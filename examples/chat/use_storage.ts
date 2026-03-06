/**
 * Example: Using storage
 */

import { storage } from '../../src/storage/database';

function main() {
  console.log('Storage operations:');
  console.log('Usage stats:', storage.getUsageStats());
}

main();
