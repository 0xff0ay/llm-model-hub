/**
 * Example: List models
 */

import { createProvider } from '../../src/core';

async function main() {
  const providers = ['openai', 'anthropic', 'google', 'mistral'];

  for (const type of providers) {
    console.log(`\n=== ${type} ===`);
    try {
      const provider = createProvider(type as any);
      const models = await provider.listModels();
      console.log(models.slice(0, 5).join(', '));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

main();
