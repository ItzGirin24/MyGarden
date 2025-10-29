const fs = require('fs');
const path = require('path');

const vitePath = path.join(__dirname, '../node_modules/.bin/vite');
try {
  fs.chmodSync(vitePath, 0o755);
  console.log('Vite executable permission fixed!');
} catch (err) {
  console.warn('Failed to set permissions for Vite, maybe on Windows:', err.message);
}
