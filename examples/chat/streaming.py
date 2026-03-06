"""
Example: Streaming chat
"""

import asyncio
from src.python.inference.engine import InferenceEngine


async def main():
    engine = InferenceEngine("openai")

    print("Streaming chat example...")
    print("=" * 50)

    async for chunk in engine.chat_stream(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Write a short poem about AI"}],
        temperature=0.7
    ):
        print(chunk, end="", flush=True)

    print("\n" + "=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
