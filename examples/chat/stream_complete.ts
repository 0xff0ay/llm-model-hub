/**
 * Example: Streaming completion
 */

import { createProvider } from '../../src/core';

async function main() {
  const provider = createProvider('openai');

  console.log('Response: ');
  for await (const chunk of provider.chatStream({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: 'Count to 5' }
    ]
  })) {
    process.stdout.write(chunk.choices[0].delta.content || '');
  }
  console.log();
}

main();
