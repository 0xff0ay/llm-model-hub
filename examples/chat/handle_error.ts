/**
 * Example: Error handling
 */

import { handleError } from '../../src/utils/errors';

function main() {
  const error = handleError(new Error('API Error'));
  console.log('Handled error:', error.name, error.message);
}

main();
