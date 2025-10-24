#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Building UNIMATE with Node.js...');

const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const child = spawn('node', [vitePath, 'build'], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
  } else {
    console.error('❌ Build failed with code:', code);
    process.exit(code);
  }
});