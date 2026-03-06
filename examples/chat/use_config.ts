/**
 * Example: Using config
 */

import { loadConfig, getConfig } from '../../src/core/config/loader';

function main() {
  const config = loadConfig();

  console.log('Default provider:', config['llm-hub'].defaultProvider);
  console.log('Default model:', config['llm-hub'].defaultModel);
  console.log('Theme:', config.ui.theme);
}

main();
