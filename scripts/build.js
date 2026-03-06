/**
 * Build script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building LLM-Model Hub...');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Compiling TypeScript...');
execSync('tsc', { stdio: 'inherit' });

console.log('Building webpack...');
execSync('webpack --mode production', { stdio: 'inherit' });

console.log('Build complete!');
