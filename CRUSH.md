# File Navigator TUI Project

## Project Overview
A terminal-based file navigator built with Bun and Ink (React for TUI) that provides a dual-panel interface for browsing the file system.

## Project Structure
```
.
├── index.ts          # Entry point for the TUI application
├── src/
│   └── App.tsx       # Main TUI component
├── package.json      # Project dependencies and scripts
├── README.md         # Project documentation
└── CRUSH.md          # This file
```

## Features
1. Dual-panel interface:
   - Left panel: Current directory contents
   - Right panel: Parent directory contents
2. Keyboard navigation:
   - Up/Down arrows: Navigate within current directory
   - Left arrow: Go to parent directory
   - Right arrow/Enter: Enter selected directory
   - Ctrl+C: Exit application

## Dependencies
- bun: JavaScript runtime
- ink: React for TUI
- react: UI library
- file-icons: File type icons (planned for future)

## Development Commands
```bash
# Install dependencies
bun install

# Run the TUI application
bun run start

# Run in development mode
bun run dev

# Install new dependencies
bun add <package-name>
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