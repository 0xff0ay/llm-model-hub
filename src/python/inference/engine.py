"""
LLM Inference Engine - Python
Provides unified inference interface for multiple LLM backends
"""

import os
import json
import asyncio
import aiohttp
from typing import Dict, List, Optional, AsyncGenerator, Any
from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass
class InferenceRequest:
    """Inference request parameters"""
    model: str
    messages: List[Dict[str, str]]
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    stop: Optional[List[str]] = None
    stream: bool = False


@dataclass
class InferenceResponse:
    """Inference response data"""
    id: str
    model: str
    content: str
    finish_reason: str
    usage: Dict[str, int]


class LLMBackend(ABC):
    """Abstract base class for LLM backends"""

    @abstractmethod
    async def chat(self, request: InferenceRequest) -> InferenceResponse:
        """Send chat request"""
        pass

    @abstractmethod
    async def chat_stream(self, request: InferenceRequest) -> AsyncGenerator[str, None]:
        """Stream chat responses"""
        pass


class OpenAIBackend(LLMBackend):
    """OpenAI API backend"""

    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.openai.com/v1"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.base_url = base_url

    async def chat(self, request: InferenceRequest) -> InferenceResponse:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "top_p": request.top_p,
            "frequency_penalty": request.frequency_penalty,
            "presence_penalty": request.presence_penalty
        }

        if request.stop:
            payload["stop"] = request.stop

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as resp:
                data = await resp.json()

                if resp.status != 200:
                    raise Exception(f"OpenAI API error: {data}")

                choice = data["choices"][0]
                return InferenceResponse(
                    id=data["id"],
                    model=data["model"],
                    content=choice["message"]["content"],
                    finish_reason=choice["finish_reason"],
                    usage=data.get("usage", {})
                )

    async def chat_stream(self, request: InferenceRequest) -> AsyncGenerator[str, None]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": True
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as resp:
                async for line in resp.content:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data = line[6:]
                        if data == '[DONE]':
                            break
                        try:
                            chunk = json.loads(data)
                            content = chunk['choices'][0].get('delta', {}).get('content', '')
                            if content:
                                yield content
                        except:
                            continue


class AnthropicBackend(LLMBackend):
    """Anthropic Claude API backend"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")

    async def chat(self, request: InferenceRequest) -> InferenceResponse:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }

        system_msg = None
        messages = []
        for msg in request.messages:
            if msg["role"] == "system":
                system_msg = msg["content"]
            else:
                messages.append(msg)

        payload = {
            "model": request.model,
            "messages": messages,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens
        }

        if system_msg:
            payload["system"] = system_msg

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload
            ) as resp:
                data = await resp.json()

                if resp.status != 200:
                    raise Exception(f"Anthropic API error: {data}")

                return InferenceResponse(
                    id=data["id"],
                    model=data["model"],
                    content=data["content"][0]["text"],
                    finish_reason=data["stop_reason"],
                    usage={
                        "prompt_tokens": data["usage"]["input_tokens"],
                        "completion_tokens": data["usage"]["output_tokens"],
                        "total_tokens": data["usage"]["input_tokens"] + data["usage"]["output_tokens"]
                    }
                )

    async def chat_stream(self, request: InferenceRequest) -> AsyncGenerator[str, None]:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }

        system_msg = None
        messages = []
        for msg in request.messages:
            if msg["role"] == "system":
                system_msg = msg["content"]
            else:
                messages.append(msg)

        payload = {
            "model": request.model,
            "messages": messages,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": True
        }

        if system_msg:
            payload["system"] = system_msg

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload
            ) as resp:
                async for line in resp.content:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data = json.loads(line[6:])
                        if data.get("type") == "content_block_delta":
                            yield data["delta"]["text"]


class OllamaBackend(LLMBackend):
    """Ollama local inference backend"""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url

    async def chat(self, request: InferenceRequest) -> InferenceResponse:
        payload = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            "stream": False
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/chat",
                json=payload
            ) as resp:
                data = await resp.json()

                if resp.status != 200:
                    raise Exception(f"Ollama error: {data}")

                return InferenceResponse(
                    id=data.get("id", "ollama-" + str(asyncio.get_event_loop().time())),
                    model=data["model"],
                    content=data["message"]["content"],
                    finish_reason="stop" if data.get("done") else "length",
                    usage={
                        "prompt_tokens": data.get("prompt_eval_count", 0),
                        "completion_tokens": data.get("eval_count", 0),
                        "total_tokens": data.get("prompt_eval_count", 0) + data.get("eval_count", 0)
                    }
                )

    async def chat_stream(self, request: InferenceRequest) -> AsyncGenerator[str, None]:
        payload = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            "stream": True
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/chat",
                json=payload
            ) as resp:
                async for line in resp.content:
                    if line:
                        try:
                            data = json.loads(line)
                            if "message" in data and "content" in data["message"]:
                                yield data["message"]["content"]
                        except:
                            continue


class InferenceEngine:
    """Unified inference engine"""

    BACKENDS = {
        "openai": OpenAIBackend,
        "anthropic": AnthropicBackend,
        "ollama": OllamaBackend,
    }

    def __init__(self, backend: str = "openai", **kwargs):
        backend_class = self.BACKENDS.get(backend)
        if not backend_class:
            raise ValueError(f"Unknown backend: {backend}")
        self.backend = backend_class(**kwargs)

    async def chat(self, **kwargs) -> InferenceResponse:
        request = InferenceRequest(**kwargs)
        return await self.backend.chat(request)

    async def chat_stream(self, **kwargs) -> AsyncGenerator[str, None]:
        request = InferenceRequest(**kwargs)
        async for chunk in self.backend.chat_stream(request):
            yield chunk


async def main():
    """Example usage"""
    engine = InferenceEngine("openai")

    response = await engine.chat(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello, how are you?"}],
        temperature=0.7,
        max_tokens=500
    )

    print(f"Response: {response.content}")
    print(f"Usage: {response.usage}")


if __name__ == "__main__":
    asyncio.run(main())
