/**
 * Clean script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirsToClean = ['dist', 'coverage', 'node_modules/.cache'];

console.log('Cleaning build artifacts...');

for (const dir of dirsToClean) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dir}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

console.log('Clean complete!');
