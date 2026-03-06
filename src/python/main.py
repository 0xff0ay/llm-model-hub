#!/usr/bin/env python3
"""
Main entry point for LLM-Model Hub Python
"""

import sys
import asyncio
import argparse
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from python.inference.engine import InferenceEngine
from python.tuning.tuner import ModelTuner, TuningBackend


def main():
    parser = argparse.ArgumentParser(description="LLM-Model Hub")
    parser.add_argument("command", choices=["chat", "tune", "api"])
    parser.add_argument("--provider", default="openai")
    parser.add_argument("--model", default="gpt-4o")
    parser.add_argument("--prompt", "-p")

    args = parser.parse_args()

    if args.command == "chat":
        async def run_chat():
            engine = InferenceEngine(args.provider)
            response = await engine.chat(
                model=args.model,
                messages=[{"role": "user", "content": args.prompt}],
                temperature=0.7,
                max_tokens=500
            )
            print(response.content)

        asyncio.run(run_chat())


if __name__ == "__main__":
    main()
