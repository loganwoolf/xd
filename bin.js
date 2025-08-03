#!/usr/bin/env node
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Start the TUI app
const child = spawn('bun', ['run', 'index.ts'], {
  stdio: ['inherit', 'inherit', 'inherit']
});

// Listen for the child process to exit
child.on('close', (code) => {
  // The app will have changed the working directory
  // Just exit with the same code
  process.exit(code);
});