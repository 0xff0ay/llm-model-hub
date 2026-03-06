/**
 * Model comparison tool
 */

import { createProvider, ProviderType } from '../../core';

export interface ModelComparison {
  provider: string;
  model: string;
  responseTime: number;
  quality: number;
  cost: number;
}

export async function compareModels(
  prompt: string,
  models: Array<{ provider: ProviderType; model: string }>
): Promise<ModelComparison[]> {
  const results: ModelComparison[] = [];

  for (const { provider, model } of models) {
    const start = Date.now();
    try {
      const p = createProvider(provider, {
        apiKey: process.env[`${provider.toUpperCase()}_API_KEY`]
      });
      await p.chat({ model, messages: [{ role: 'user', content: prompt }] });
      results.push({
        provider,
        model,
        responseTime: Date.now() - start,
        quality: 0,
        cost: 0
      });
    } catch (e) {
      console.error(`Error with ${provider}/${model}:`, e);
    }
  }

  return results;
}
