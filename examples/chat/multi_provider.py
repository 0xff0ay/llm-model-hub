"""
Example: Using multiple providers
"""

import asyncio
from src.python.inference.engine import InferenceEngine


async def main():
    providers = ["openai", "anthropic", "ollama"]
    prompt = "What is machine learning?"

    for provider in providers:
        try:
            print(f"\n=== {provider.upper()} ===")
            engine = InferenceEngine(provider)
            response = await engine.chat(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500
            )
            print(response.content[:200] + "...")
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
