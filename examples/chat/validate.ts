/**
 * Example: Validate input
 */

import { validateApiKey, validateModel, validateTemperature } from '../../src/utils/validation';

function main() {
  console.log('Validating API key...');
  console.log(validateApiKey('sk-test123'));

  console.log('\nValidating model...');
  console.log(validateModel('gpt-4o'));

  console.log('\nValidating temperature...');
  console.log(validateTemperature(0.7));
}

main();
