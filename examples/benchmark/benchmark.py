"""
Example: Model Benchmarking
Benchmark different models
"""

import asyncio
import time
from src.python.inference.engine import InferenceEngine


async def benchmark_model(backend: str, model: str, prompt: str, iterations: int = 3):
    """Benchmark a single model"""
    engine = InferenceEngine(backend)

    times = []
    for i in range(iterations):
        start = time.time()
        response = await engine.chat(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        elapsed = time.time() - start
        times.append(elapsed)
        print(f"  Iteration {i+1}: {elapsed:.2f}s")

    avg_time = sum(times) / len(times)
    return {
        "backend": backend,
        "model": model,
        "avg_time": avg_time,
        "min_time": min(times),
        "max_time": max(times)
    }


async def main():
    """Run benchmarks"""
    print("=== LLM-Model Hub - Model Benchmark ===\n")

    prompt = "Explain quantum computing in simple terms."

    benchmarks = [
        ("openai", "gpt-4o"),
        ("openai", "gpt-3.5-turbo"),
    ]

    results = []
    for backend, model in benchmarks:
        print(f"\nBenchmarking {backend}/{model}...")
        result = await benchmark_model(backend, model, prompt)
        results.append(result)

    print("\n=== Results ===")
    for r in results:
        print(f"{r['backend']}/{r['model']}: avg={r['avg_time']:.2f}s, min={r['min_time']:.2f}s, max={r['max_time']:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
