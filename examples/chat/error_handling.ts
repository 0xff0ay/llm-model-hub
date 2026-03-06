/**
 * Example: Error handling
 */

import { handleError, LLMError } from '../../src/utils/errors';

async function main() {
  try {
    const { createProvider } = await import('../../src/core');
    const provider = createProvider('openai');
    await provider.chat({ model: 'invalid-model', messages: [] });
  } catch (e) {
    const error = handleError(e);
    console.log('Error type:', error.name);
    console.log('Message:', error.message);
  }
}

main();
