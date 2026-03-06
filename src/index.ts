/**
 * Main entry point
 */

import { startTUI } from './tui/app';

async function main() {
  try {
    await startTUI();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
