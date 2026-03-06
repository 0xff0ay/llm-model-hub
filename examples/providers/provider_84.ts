/**
 * Provider example file 84
 */

import { createProvider } from '../../src/core';

export async function example_84() {
  const provider = createProvider('openai');
  const response = await provider.chat({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello' }]
  });
  return response;
}
