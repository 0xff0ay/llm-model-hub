/**
 * Example: Benchmark
 */

import { runBenchmark, formatBenchmarkResult } from '../../src/models/benchmark/benchmark';

async function main() {
  const result = await runBenchmark({
    prompt: 'What is AI?',
    iterations: 2,
    provider: 'openai',
    model: 'gpt-3.5-turbo'
  });

  console.log(formatBenchmarkResult(result));
}

main();
