# File Navigator TUI

A terminal-based file navigator built with Bun and Ink (React for TUI).

## Features

- Dual-panel interface:
  - Left panel: Current directory contents
  - Right panel: Parent directory contents
- Keyboard navigation:
  - Up/Down arrows: Navigate within current directory
  - Left arrow: Go to parent directory
  - Right arrow/Enter: Enter selected directory
  - Ctrl+C: Exit application

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the application:
   ```bash
   bun run start
   ```

## Limitations

The application may not work properly in all terminal environments due to limitations with raw mode input. For best results, run in a terminal that supports raw mode like Windows Terminal or a Unix terminal.

## Future Enhancements

1. File icons for different file types
2. File operations (create, delete, rename)
3. File content preview
4. Search functionality
5. Multiple tab support
6. File/directory information panel