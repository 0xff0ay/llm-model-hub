"""
REST API Server for LLM-Model Hub
"""

import asyncio
import json
from typing import Dict, Any, Optional
from dataclasses import dataclass
from aiohttp import web
import argparse

from ..python.inference.engine import InferenceEngine
from ..python.tokenizer.tokenizer import TokenizerFactory


@dataclass
class APIConfig:
    """API configuration"""
    host: str = "0.0.0.0"
    port: int = 3000
    cors_origins: str = "*"
    api_key: Optional[str] = None


class LLMHubAPI:
    """REST API server"""

    def __init__(self, config: APIConfig):
        self.config = config
        self.app = web.Application()
        self._setup_routes()
        self.engine = InferenceEngine("openai")

    def _setup_routes(self):
        """Setup API routes"""
        self.app.router.add_get('/', self.handle_index)
        self.app.router.add_get('/health', self.handle_health)
        self.app.router.add_post('/api/chat', self.handle_chat)
        self.app.router.add_post('/api/chat/stream', self.handle_chat_stream)
        self.app.router.add_get('/api/models', self.handle_models)
        self.app.router.add_get('/api/providers', self.handle_providers)

    async def handle_index(self, request):
        """Index handler"""
        return web.json_response({
            "name": "LLM-Model Hub API",
            "version": "1.0.0",
            "status": "running"
        })

    async def handle_health(self, request):
        """Health check"""
        return web.json_response({"status": "healthy"})

    async def handle_chat(self, request):
        """Chat endpoint"""
        try:
            data = await request.json()

            messages = data.get("messages", [])
            model = data.get("model", "gpt-4o")
            temperature = data.get("temperature", 0.7)
            max_tokens = data.get("max_tokens", 2048)

            response = await self.engine.chat(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )

            return web.json_response({
                "id": response.id,
                "model": response.model,
                "content": response.content,
                "finish_reason": response.finish_reason,
                "usage": response.usage
            })

        except Exception as e:
            return web.json_response({
                "error": str(e)
            }, status=500)

    async def handle_chat_stream(self, request):
        """Streaming chat endpoint"""
        try:
            data = await request.json()

            messages = data.get("messages", [])
            model = data.get("model", "gpt-4o")
            temperature = data.get("temperature", 0.7)
            max_tokens = data.get("max_tokens", 2048)

            response = web.StreamResponse()
            response.content_type = 'text/event-stream'
            response.headers['Cache-Control'] = 'no-cache'
            response.headers['Connection'] = 'keep-alive'
            await response.prepare(request)

            async for chunk in self.engine.chat_stream(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            ):
                await response.write(f"data: {json.dumps({'content': chunk})}\n\n".encode())

            await response.write(b"data: [DONE]\n\n")
            return response

        except Exception as e:
            return web.json_response({
                "error": str(e)
            }, status=500)

    async def handle_models(self, request):
        """List models"""
        models = [
            {"id": "gpt-4o", "name": "GPT-4o", "provider": "openai"},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "provider": "openai"},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai"},
            {"id": "claude-3-5-sonnet", "name": "Claude 3.5 Sonnet", "provider": "anthropic"},
            {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "google"},
        ]
        return web.json_response(models)

    async def handle_providers(self, request):
        """List providers"""
        providers = [
            {"id": "openai", "name": "OpenAI"},
            {"id": "anthropic", "name": "Anthropic"},
            {"id": "google", "name": "Google"},
            {"id": "azure", "name": "Azure OpenAI"},
            {"id": "aws", "name": "AWS Bedrock"},
            {"id": "cohere", "name": "Cohere"},
            {"id": "huggingface", "name": "HuggingFace"},
            {"id": "ollama", "name": "Ollama"},
            {"id": "mistral", "name": "Mistral"},
            {"id": "replicate", "name": "Replicate"},
        ]
        return web.json_response(providers)

    def run(self):
        """Run the server"""
        web.run_app(
            self.app,
            host=self.config.host,
            port=self.config.port
        )


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="LLM-Model Hub API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=3000, help="Port to bind to")
    parser.add_argument("--api-key", help="API key for authentication")

    args = parser.parse_args()

    config = APIConfig(
        host=args.host,
        port=args.port,
        api_key=args.api_key
    )

    api = LLMHubAPI(config)
    print(f"Starting API server on http://{args.host}:{args.port}")
    api.run()


if __name__ == "__main__":
    main()
