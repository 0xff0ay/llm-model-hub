"""
Python prompt utilities
"""

from typing import Dict, List, Optional


class PromptBuilder:
    """Build prompts for different tasks"""

    SYSTEM_PROMPTS = {
        "assistant": "You are a helpful AI assistant.",
        "coder": "You are an expert programmer. Write clean, well-documented code.",
        "writer": "You are a creative writer. Write engaging content.",
        "analyst": "You are a data analyst. Provide insightful analysis.",
    }

    @staticmethod
    def build(prompt: str, system: Optional[str] = None, context: Optional[Dict] = None) -> List[Dict]:
        """Build message list"""
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if context:
            context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
            prompt = f"{context_str}\n\n{prompt}"
        messages.append({"role": "user", "content": prompt})
        return messages

    @staticmethod
    def build_conversation(history: List[Dict], new_prompt: str) -> List[Dict]:
        """Build conversation with history"""
        return history + [{"role": "user", "content": new_prompt}]
