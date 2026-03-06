/**
 * Example: Provider switching
 */

import { createProvider, ProviderType } from '../../src/core';

async function main() {
  const providers: ProviderType[] = ['openai', 'anthropic', 'google', 'ollama'];
  const prompt = 'Hello!';

  for (const providerType of providers) {
    try {
      const provider = createProvider(providerType, {
        apiKey: process.env[`${providerType.toUpperCase()}_API_KEY`]
      });

      console.log(`\n=== ${provider.name} ===`);
      const response = await provider.chat({
        model: provider.defaultModel,
        messages: [{ role: 'user', content: prompt }]
      });

      console.log(response.choices[0].message.content.substring(0, 100) + '...');
    } catch (e: any) {
      console.log(`Error: ${e.message}`);
    }
  }
}

main();
