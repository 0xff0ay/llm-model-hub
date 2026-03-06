/**
 * Python CLI entry
 */

import sys
from src.python.inference.engine import InferenceEngine


def main():
    if len(sys.argv) < 2:
        print("Usage: python -m src.python.main <prompt>")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:])
    engine = InferenceEngine("openai")

    import asyncio
    response = asyncio.run(engine.chat(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    ))
    print(response.content)


if __name__ == "__main__":
    main()
