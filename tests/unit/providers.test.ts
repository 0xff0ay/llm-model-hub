/**
 * Unit tests for providers
 */

import { createProvider } from '../src/core/providers';

describe('Provider Factory', () => {
  test('creates OpenAI provider', () => {
    const provider = createProvider('openai');
    expect(provider.name).toBe('OpenAI');
  });

  test('creates Anthropic provider', () => {
    const provider = createProvider('anthropic');
    expect(provider.name).toBe('Anthropic');
  });

  test('creates Google provider', () => {
    const provider = createProvider('google');
    expect(provider.name).toBe('Google');
  });

  test('throws error for unknown provider', () => {
    expect(() => createProvider('unknown' as any)).toThrow();
  });
});
