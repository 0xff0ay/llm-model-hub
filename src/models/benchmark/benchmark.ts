/**
 * Benchmark utilities
 */

import { createProvider, ProviderType } from '../../core';

export interface BenchmarkResult {
  provider: string;
  model: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  tokensPerSecond: number;
  success: boolean;
  error?: string;
}

export interface BenchmarkOptions {
  prompt: string;
  iterations: number;
  provider: ProviderType;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export async function runBenchmark(options: BenchmarkOptions): Promise<BenchmarkResult> {
  const { prompt, iterations, provider, model, temperature = 0.7, maxTokens = 500 } = options;

  const times: number[] = [];
  let totalTokens = 0;

  try {
    const providerInstance = createProvider(provider, {
      apiKey: process.env[`${provider.toUpperCase()}_API_KEY`]
    });

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();

      const response = await providerInstance.chat({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
      });

      const elapsed = (Date.now() - start) / 1000;
      times.push(elapsed);
      totalTokens += response.usage?.total_tokens || 0;
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const totalTime = times.reduce((a, b) => a + b, 0);
    const tokensPerSecond = totalTokens / totalTime;

    return {
      provider,
      model,
      avgTime,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      tokensPerSecond,
      success: true
    };
  } catch (error: any) {
    return {
      provider,
      model,
      avgTime: 0,
      minTime: 0,
      maxTime: 0,
      tokensPerSecond: 0,
      success: false,
      error: error.message
    };
  }
}

export function formatBenchmarkResult(result: BenchmarkResult): string {
  if (!result.success) {
    return `${result.provider}/${result.model}: FAILED - ${result.error}`;
  }

  return `${result.provider}/${result.model}: avg=${result.avgTime.toFixed(2)}s, ` +
    `min=${result.minTime.toFixed(2)}s, max=${result.maxTime.toFixed(2)}s, ` +
    `tokens/s=${result.tokensPerSecond.toFixed(1)}`;
}
