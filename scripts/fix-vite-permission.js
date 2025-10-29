import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vitePath = path.join(__dirname, '../node_modules/.bin/vite');
try {
  fs.chmodSync(vitePath, 0o755);
  console.log('Vite executable permission fixed!');
} catch (err) {
  console.warn('Failed to set permissions for Vite, maybe on Windows:', err.message);
}
