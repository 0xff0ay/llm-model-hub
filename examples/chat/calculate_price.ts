/**
 * Example: Price calculation
 */

import { calculatePrice, getModelPrice } from '../../src/utils/pricing';

function main() {
  const model = 'gpt-4o';
  const price = getModelPrice(model);

  console.log(`Model: ${model}`);
  console.log(`Price per 1M tokens: $${price?.inputPrice} input, $${price?.outputPrice} output`);

  const cost = calculatePrice(model, 1000, 500);
  console.log(`Cost for 1K input + 500 output tokens: $${cost.toFixed(4)}`);
}

main();
