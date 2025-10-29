import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vitePath = path.join(__dirname, '../node_modules/.bin/vite');

console.log('Attempting to fix vite permissions...');
console.log('Vite path:', vitePath);

try {
  // Check if file exists
  if (fs.existsSync(vitePath)) {
    console.log('Vite binary found, setting permissions...');
    fs.chmodSync(vitePath, 0o755);
    console.log('Vite executable permission fixed successfully!');
  } else {
    console.warn('Vite binary not found at expected path');
  }
} catch (err) {
  console.warn('Failed to set permissions for Vite:', err.message);
  // Try alternative approach with chmod command
  try {
    console.log('Trying alternative chmod command...');
    execSync(`chmod +x "${vitePath}"`, { stdio: 'inherit' });
    console.log('Vite executable permission fixed with chmod command!');
  } catch (chmodErr) {
    console.warn('Alternative chmod also failed:', chmodErr.message);
  }
}
