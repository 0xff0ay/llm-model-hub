"""
Example: Token usage tracking
"""

import asyncio
from src.python.inference.engine import InferenceEngine


async def main():
    engine = InferenceEngine("openai")

    print("Token usage tracking example...")
    print("=" * 50)

    response = await engine.chat(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Explain quantum computing in simple terms."}
        ],
        temperature=0.7,
        max_tokens=1000
    )

    print(f"Response: {response.content[:100]}...")
    print(f"\nUsage:")
    print(f"  Prompt tokens: {response.usage.get('prompt_tokens', 0)}")
    print(f"  Completion tokens: {response.usage.get('completion_tokens', 0)}")
    print(f"  Total tokens: {response.usage.get('total_tokens', 0)}")


if __name__ == "__main__":
    asyncio.run(main())
