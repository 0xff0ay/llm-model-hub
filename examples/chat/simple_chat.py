"""
Example: Simple Chat
Simple chat example using the LLM-Model Hub
"""

import asyncio
from src.python.inference.engine import InferenceEngine


async def main():
    """Run a simple chat"""
    engine = InferenceEngine("openai")

    print("=== LLM-Model Hub - Simple Chat ===\n")

    messages = []

    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            break

        messages.append({"role": "user", "content": user_input})

        response = await engine.chat(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        print(f"\nAssistant: {response.content}\n")

        messages.append({"role": "assistant", "content": response.content})


if __name__ == "__main__":
    asyncio.run(main())
