/**
 * Example: Using all utilities
 */

import { truncate, formatTokens, validateApiKey, formatDuration } from '../../src/utils';

function main() {
  console.log('Truncate:', truncate('Hello World', 8));
  console.log('Format tokens:', formatTokens(5000));
  console.log('Validate API key:', validateApiKey('test-key'));
  console.log('Format duration:', formatDuration(5000));
}

main();
