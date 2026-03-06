/**
 * Provider example file 2
 */

import { createProvider } from '../../src/core';

export async function example_2() {
  const provider = createProvider('openai');
  const response = await provider.chat({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello' }]
  });
  return response;
}
