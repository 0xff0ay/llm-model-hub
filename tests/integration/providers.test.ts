/**
 * Integration test for providers
 */

import { createProvider } from '../src/core/providers';

describe('Provider Integration', () => {
  test('can create all provider types', () => {
    const providers = [
      'openai',
      'anthropic',
      'google',
      'azure',
      'aws',
      'cohere',
      'huggingface',
      'ollama',
      'mistral',
      'replicate'
    ];

    for (const type of providers) {
      const provider = createProvider(type as any);
      expect(provider).toBeDefined();
      expect(provider.name).toBeDefined();
    }
  });
});
