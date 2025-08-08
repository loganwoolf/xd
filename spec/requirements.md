
# Cross-Platform TUI File Explorer CLI (`xd`) — Complete Requirements

Here is a combined, refined, and comprehensive requirements specification for your cross-platform TUI file explorer CLI app (`xd`), synthesizing all your original needs plus the later enhancements and tooling choices:


## 1. **Technology Stack**
- Language: **JavaScript** (or optionally TypeScript)
- UI Libraries: **React** + **Ink** (for terminal UI rendering)
- Runtime/Build: Use **Bun** as build tool and runtime for:
  - Native JSX support (no Babel required)
  - Fast bundling
  - Standalone executable generation (`bun build --compile`)
- Node.js standard libraries (e.g., `fs`, `path`) for file system operations—ensure cross-platform compatibility (Windows, Linux, macOS).


## 2. **App Structure & UI**
- **Two-panel layout**, side by side:
  - **Folders panel (left):**
    - Displays current working directory (cwd) at the top.
    - Lists immediate child folders plus an entry “.” representing the cwd itself.
    - Navigation:
      - **Up/down arrows** to move selection among folders and “.”.
      - **Right arrow** enters the highlighted subfolder (sets new cwd).
      - **Left arrow** goes to parent directory (cwd’s parent — “..”).
  - **Contents panel (right):**
    - Displays files and folders (with icons) inside the currently selected folder from the folder panel.
  
- **Height constraint:**
  - Both panels have a maximum height of **16 lines**.
  - If content exceeds this height, implement **scrolling** as user navigates.

- **Scrolling behavior:**
  - Starts scrolling when the current selection approaches within **3 lines** from the bottom of the visible panel.
  - Smooth vertical scrolling to keep selection visible.
  - Scroll up appropriately if selection moves upward past the visible window.

- **Keyboard navigation and selection:**
  - Use Ink’s `useInput()` to handle arrow keys and other hotkeys.
  - Ensure selection cannot go out of bounds (at top or bottom limits).
  - Manage scroll offset to keep selection visible.


## 3. **Visual & UX Elements**
- Icons (ASCII or Unicode) to distinguish files vs. folders in the contents panel.
- Clear visual separation between panels using borders, color, or spacing.
- Color highlights to indicate the current selection in both panels.
- A fixed footer bar at the bottom (outside the two panels), showing:
  - **Hotkeys legend** (e.g., arrow keys, special keys with their actions)
  - Always visible, clearly styled, and does not scroll with content.


## 4. **Special Features**
- A **special key** (e.g., `g` or another defined key) to “navigate the terminal” to the currently selected folder upon exiting the app:
  - On pressing this key, save the selected folder path.
  - Upon exit, emit this path in a way that the caller shell or script can `cd` to that folder (since a child process cannot directly navigate the parent shell).
  - This can be implemented by printing the folder path to stdout or writing to a temp file that a wrapper shell script reads to perform the final `cd`.


## 5. **State Management**
- Track the following with React’s state/hooks:
  - Current working directory (cwd)
  - List of child folders in cwd.
  - Selected folder index in folders panel.
  - Selected file/folder index in contents panel.
  - Scroll offset per panel to implement scrolling.
- Update folder contents dynamically as cwd changes.


## 6. **Cross-Platform Support**
- Use Node.js native `fs` and `path` APIs for directory and file operations.
- Avoid any OS-specific dependencies or calls.
- Handle path separators and case sensitivity accordingly.


## 7. **Packaging and Distribution**
- Use **Bun**’s `bun build --compile` to create a **standalone binary executable** for each target platform.
- Support cross-compiling builds for:
  - Linux x64
  - macOS arm64/x64
  - Windows x64
- Binary name: `xd` (to match the CLI entry command).
- Also provide an **npm package** as a fallback/distribution method with `"bin": { "xd": "./cli.js" }` in `package.json`.
- Installation via:
  - Global npm install (`npm install -g your-package-name`)
  - Or via directly downloading the Bun-compiled executable.


## 8. **Future-Proof Extensions (Optional)**
- File previews or simple file operations in the contents panel.
- Searching/filtering folders or files.
- Multi-panel navigation (e.g., tab switch between panels).
- Theming or color scheme customization.
- Integrate worker threads or async operations to keep UI responsive on large directories.

***

## Example Hotkeys Summary (for footer display)
| Key         | Action                                                 |
|-------------|--------------------------------------------------------|
| ↑ / ↓       | Move selection up/down                                 |
| →           | Enter highlighted folder (change cwd)                  |
| ←           | Go to parent directory (cwd’s parent)                  |
| g (example) | On exit, print path for shell to `cd` into that folder |
| q or Ctrl+C | Quit/exit the app                                      |
