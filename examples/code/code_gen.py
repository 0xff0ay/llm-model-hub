"""
Example: Code Generation
Code generation example using LLM-Model Hub
"""

import asyncio
from src.python.inference.engine import InferenceEngine


async def main():
    """Run code generation example"""
    engine = InferenceEngine("openai")

    print("=== LLM-Model Hub - Code Generation ===\n")

    prompts = [
        "Write a Python function to calculate factorial",
        "Create a React component for a button with hover effect",
        "Write SQL query to find duplicate records",
        "Create a Docker Compose file for a Node.js app with MongoDB",
    ]

    for i, prompt in enumerate(prompts, 1):
        print(f"\n--- Example {i} ---")
        print(f"Prompt: {prompt}\n")

        response = await engine.chat(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a code assistant. Write clean-commented code."},
                {"role, well": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        print(f"Generated Code:\n{response.content}\n")
        print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
