/**
 * Example: Using Ollama
 */

import { createProvider } from '../../src/core';

async function main() {
  const provider = createProvider('ollama');

  const response = await provider.chat({
    model: 'llama3.1',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  });

  console.log(response.choices[0].message.content);
}

main();
