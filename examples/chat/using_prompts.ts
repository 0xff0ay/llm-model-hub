/**
 * Example: Using prompts
 */

import { builtInTemplates, applyTemplate } from '../../src/utils/templates';

function main() {
  console.log('Available templates:');
  for (const t of builtInTemplates) {
    console.log(`  - ${t.id}: ${t.name}`);
  }

  const formatted = applyTemplate(builtInTemplates[0], {
    length: '50',
    text: 'This is a sample text to summarize.'
  });

  console.log('\nFormatted prompt:');
  console.log(formatted);
}

main();
