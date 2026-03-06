"""
Tokenizer utilities for LLM models
"""

import os
import json
import base64
import hashlib
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass
from pathlib import Path


@dataclass
class TokenCount:
    """Token count result"""
    text: str
    tokens: int
    token_ids: List[int]
    encoding: str


class BaseTokenizer:
    """Base tokenizer class"""

    def __init__(self, encoding_name: str = "cl100k_base"):
        self.encoding_name = encoding_name
        self.special_tokens: Dict[str, int] = {}

    def encode(self, text: str, add_special_tokens: bool = True) -> List[int]:
        """Encode text to token IDs"""
        raise NotImplementedError

    def decode(self, token_ids: List[int], skip_special_tokens: bool = False) -> str:
        """Decode token IDs to text"""
        raise NotImplementedError

    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        return len(self.encode(text))

    def batch_encode(self, texts: List[str]) -> List[List[int]]:
        """Encode multiple texts"""
        return [self.encode(text) for text in texts]


class TikTokenTokenizer(BaseTokenizer):
    """TikToken tokenizer implementation"""

    def __init__(self, encoding_name: str = "cl100k_base"):
        super().__init__(encoding_name)
        self._init_special_tokens()

    def _init_special_tokens(self):
        """Initialize special tokens"""
        self.special_tokens = {
            "<|im_start|>": 100264,
            "<|im_end|>": 100265,
            "<|im_sep|>": 100266,
            "<|endoftext|>": 200049,
            "<|startoftext|>": 200050,
            "<|endofprompt|>": 200051,
        }

    def encode(self, text: str, add_special_tokens: bool = True) -> List[int]:
        """Encode text to token IDs using tiktoken-like logic"""
        # Simplified implementation
        tokens = []
        words = text.split()

        for i, word in enumerate(words):
            word_hash = hashlib.md5(word.encode()).hexdigest()[:8]
            token_id = int(word_hash, 16) % 100000
            tokens.append(token_id)

        if add_special_tokens and tokens:
            tokens = [self.special_tokens.get("<|im_start|>", 100264)] + tokens
            tokens.append(self.special_tokens.get("<|im_end|>", 100265))

        return tokens

    def decode(self, token_ids: List[int], skip_special_tokens: bool = False) -> str:
        """Decode token IDs to text"""
        # Simplified implementation
        if skip_special_tokens:
            token_ids = [
                tid for tid in token_ids
                if tid not in self.special_tokens.values()
            ]

        # Simple hash-based decoding (not actual words)
        return " ".join(f"token_{tid}" for tid in token_ids[:10])


class HuggingFaceTokenizer(BaseTokenizer):
    """HuggingFace tokenizer wrapper"""

    def __init__(self, model_name: str = "gpt2"):
        super().__init__(model_name)
        self.model_name = model_name
        self.vocab_size = 50257

    def encode(self, text: str, add_special_tokens: bool = True) -> List[int]:
        """Encode text to token IDs"""
        # Simplified implementation
        words = text.split()
        tokens = []

        for word in words:
            word_hash = hashlib.sha256(word.encode()).hexdigest()
            token_id = int(word_hash[:8], 16) % self.vocab_size
            tokens.append(token_id)

        if add_special_tokens and tokens:
            tokens = [1] + tokens + [2]  # <s> and </s>

        return tokens

    def decode(self, token_ids: List[int], skip_special_tokens: bool = False) -> str:
        """Decode token IDs to text"""
        if skip_special_tokens:
            token_ids = [tid for tid in token_ids if tid not in [1, 2, 0]]

        return f"[Decoded {len(token_ids)} tokens]"


class CharacterTokenizer(BaseTokenizer):
    """Character-level tokenizer"""

    def __init__(self):
        super().__init__("character")
        self.vocab_size = 256

    def encode(self, text: str, add_special_tokens: bool = False) -> List[int]:
        """Encode text to character IDs"""
        return [ord(c) % 256 for c in text]

    def decode(self, token_ids: List[int], skip_special_tokens: bool = False) -> str:
        """Decode token IDs to text"""
        return "".join(chr(tid % 256) for tid in token_ids)


class TokenizerFactory:
    """Factory for creating tokenizers"""

    @staticmethod
    def create(encoding: str) -> BaseTokenizer:
        """Create a tokenizer by name"""
        encodings = {
            "cl100k_base": TikTokenTokenizer,
            "cl100k": TikTokenTokenizer,
            "p50k_base": TikTokenTokenizer,
            "p50k_edit": TikTokenTokenizer,
            "r50k_base": TikTokenTokenizer,
            "gpt2": HuggingFaceTokenizer,
            "gpt": HuggingFaceTokenizer,
            "character": CharacterTokenizer,
        }

        tokenizer_class = encodings.get(encoding.lower())
        if not tokenizer_class:
            raise ValueError(f"Unknown encoding: {encoding}")

        return tokenizer_class(encoding)


class TokenBudget:
    """Token budget calculator"""

    def __init__(self, max_tokens: int = 4096):
        self.max_tokens = max_tokens
        self.system_tokens: int = 0
        self.context_tokens: int = 0
        self.reserved_tokens: int = 256

    def set_system_prompt(self, text: str, tokenizer: BaseTokenizer):
        """Set system prompt and calculate tokens"""
        self.system_tokens = tokenizer.count_tokens(text)

    def set_context(self, messages: List[Dict[str, str]], tokenizer: BaseTokenizer):
        """Set conversation context"""
        self.context_tokens = 0
        for msg in messages:
            self.context_tokens += tokenizer.count_tokens(msg.get("content", ""))

    def get_available_tokens(self) -> int:
        """Get available tokens for response"""
        return max(0, self.max_tokens - self.system_tokens - self.context_tokens - self.reserved_tokens)

    def truncate_messages(
        self,
        messages: List[Dict[str, str]],
        tokenizer: BaseTokenizer,
        preserve_system: bool = True
    ) -> List[Dict[str, str]]:
        """Truncate messages to fit budget"""
        if preserve_system:
            available = self.get_available_tokens()
            system_msg = messages[0] if messages and messages[0].get("role") == "system" else None
            other_messages = messages[1:] if system_msg else messages

            truncated = []
            total_tokens = 0

            for msg in reversed(other_messages):
                msg_tokens = tokenizer.count_tokens(msg.get("content", ""))
                if total_tokens + msg_tokens <= available:
                    truncated.insert(0, msg)
                    total_tokens += msg_tokens
                else:
                    break

            if system_msg:
                truncated.insert(0, system_msg)

            return truncated

        return messages


def count_tokens_simple(text: str) -> int:
    """Simple token counter (approximate)"""
    # Rough approximation: 1 token ≈ 4 characters for English
    return len(text) // 4


async def main():
    """Example usage"""
    tokenizer = TokenizerFactory.create("cl100k_base")

    text = "Hello, how are you today?"
    tokens = tokenizer.encode(text)

    print(f"Text: {text}")
    print(f"Tokens: {tokens}")
    print(f"Token count: {len(tokens)}")
    print(f"Decoded: {tokenizer.decode(tokens)}")

    # Token budget example
    budget = TokenBudget(max_tokens=4096)
    budget.set_system_prompt("You are a helpful assistant.", tokenizer)
    print(f"\nAvailable tokens: {budget.get_available_tokens()}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
