/**
 * Example: Rate limiter
 */

import { RateLimiter } from '../../src/utils/ratelimit';

async function main() {
  const limiter = new RateLimiter(5, 1000);

  for (let i = 0; i < 10; i++) {
    await limiter.acquire();
    console.log(`Request ${i + 1} allowed. Tokens left: ${limiter.getAvailableTokens()}`);
  }
}

main();
