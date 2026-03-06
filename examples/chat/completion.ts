/**
 * Example: Chat completion
 */

import { createProvider } from '../../src/core';

async function main() {
  const provider = createProvider('openai');

  const response = await provider.chat({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  });

  console.log(response.choices[0].message.content);
}

main();
