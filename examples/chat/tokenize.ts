/**
 * Example: Token counting
 */

import { TokenizerFactory } from '../../src/python/tokenizer/tokenizer';

function main() {
  const tokenizer = TokenizerFactory.create("cl100k_base");
  const text = "Hello, how are you today?";
  const tokens = tokenizer.encode(text);
  console.log(`Text: ${text}`);
  console.log(`Token count: ${tokens.length}`);
}

main();
