#!/usr/bin/env bun
import React from 'react';
import { render } from 'ink';
import App from './src/App.js';

// Create a simple test version that doesn't use useInput
const TestApp: React.FC = () => {
  return (
    <div>
      <h1>File Navigator TUI</h1>
      <p>This is a test version of the file navigator TUI.</p>
      <p>To run the full interactive version, you may need to run this in a different terminal environment.</p>
    </div>
  );
};

render(React.createElement(TestApp));