# Implementation TODO List

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Project Bootstrap (Sequential)
- [ ] Install core dependencies with Bun (React, Ink, @types/node)
- [ ] Create bunfig.toml for Bun configuration (JSX, build settings)
- [ ] Setup TypeScript configuration (tsconfig.json)
- [ ] Create basic project structure (src/, components/, utils/)
- [ ] Create cli.js entry point for executable

### 1.2 Core Utilities (Can be done concurrently)

#### 1.2a File System Operations
- [ ] Create file system utility functions (src/utils/fs.js)
  - [ ] `readDirectory()` - async directory reading with error handling
  - [ ] `getDirectoryContents()` - separate files/folders, sort alphabetically
  - [ ] `isDirectory()`, `isFile()` helper functions
  - [ ] Permission error handling ("inadequate permissions")

#### 1.2b Path Management
- [ ] Create path utility functions (src/utils/path.js)
  - [ ] Cross-platform path resolution
  - [ ] Parent directory navigation (with filesystem root protection)
  - [ ] Path truncation for display
  - [ ] Working directory management

#### 1.2c State Management Hooks
- [ ] Create custom hooks (src/hooks/)
  - [ ] `useDirectoryState()` - manage current directory, folder list
  - [ ] `useSelection()` - manage selection indices and focus
  - [ ] `useScrolling()` - manage scroll offsets per panel

## Phase 2: Core Components (Can be developed concurrently)

### 2.1 Layout Components

#### 2.1a Main App Structure
- [ ] Create `App.jsx` - main application component
- [ ] Implement two-panel layout structure
- [ ] Add keyboard event handling setup (`useInput()`)

#### 2.1b Panel Components
- [ ] `FoldersPanel.jsx` - left panel for directory navigation
  - [ ] Display current working directory at top
  - [ ] List child folders + "." entry
  - [ ] Selection highlighting
  - [ ] 16-line height constraint
- [ ] `ContentsPanel.jsx` - right panel for file/folder display
  - [ ] Display files and folders with icons
  - [ ] Alphabetical sorting
  - [ ] Hidden file display
  - [ ] Name truncation
  - [ ] 16-line height constraint

#### 2.1c UI Components
- [ ] `Footer.jsx` - hotkey legend display
  - [ ] Fixed position footer
  - [ ] Hotkey reference table
  - [ ] Dark theme styling

### 2.2 Core Features (Sequential dependencies within each)

#### 2.2a Navigation System
- [ ] Implement arrow key navigation (up/down selection)
- [ ] Implement right arrow (enter folder)
- [ ] Implement left arrow (parent directory / return to folders)
- [ ] Implement Tab key (switch panel focus)
- [ ] Selection boundary protection
- [ ] Selection position memory

#### 2.2b Scrolling System
- [ ] Implement scroll offset calculation
- [ ] 3-line scroll trigger implementation
- [ ] Smooth scrolling behavior
- [ ] Keep selection visible logic

## Phase 3: Advanced Features & Polish

### 3.1 Exit & Shell Integration (Sequential)
- [ ] Implement `q` key for normal quit
- [ ] Implement `Q` key for quit with navigation
- [ ] Shell path output mechanism (stdout or temp file)
- [ ] Test shell integration with wrapper script

### 3.2 Visual Polish (Can be done concurrently)

#### 3.2a Icons & Styling
- [ ] File type icon system (folders, files, executables)
- [ ] Dark theme color scheme implementation
- [ ] Panel borders and visual separation
- [ ] Focus indication styling

#### 3.2b Loading & Error States
- [ ] Async loading indicators
- [ ] Permission error display
- [ ] Empty directory handling
- [ ] Loading state transitions

### 3.3 Performance & Optimization (Sequential)
- [ ] Large directory detection
- [ ] Performance optimization options
- [ ] Memory usage optimization
- [ ] Async file loading implementation

## Phase 4: Build & Distribution

### 4.1 Build System (Sequential)
- [ ] Development run configuration (`bun run cli.js`)
- [ ] Bun compilation setup (`bun build --compile cli.js --outfile xd`)
- [ ] Cross-platform build scripts
- [ ] Binary optimization flags

### 4.2 Testing & Validation (Can be done concurrently)
- [ ] Manual testing on different platforms
- [ ] Edge case testing (large directories, permissions, etc.)
- [ ] Performance testing
- [ ] Shell integration testing

### 4.3 Distribution (Sequential)
- [ ] Binary distribution setup for multiple platforms
- [ ] Installation script creation (direct binary download)
- [ ] Shell wrapper script for navigation feature
- [ ] Documentation updates

## Concurrent Development Opportunities

### High Parallelism Phases:
- **Phase 1.2**: All utility functions can be developed independently
- **Phase 2.1**: All components can be built in parallel once interfaces are defined
- **Phase 3.2**: Visual polish items are mostly independent

### Medium Parallelism:
- **Phase 2.2**: Navigation and scrolling can be developed in parallel if interfaces are well-defined
- **Phase 4.2**: Testing activities can run concurrent to Phase 4.1

### Sequential Dependencies:
- Project setup must complete before component development
- Core navigation must work before implementing exit features
- Build system needs working app before optimization
- Shell integration testing requires completed build system

## Development Strategy Recommendations:

1. **Start with Phase 1.1** (bootstrap) - single developer
2. **Split Phase 1.2** across multiple developers if available
3. **Phase 2.1** - can assign one component per developer
4. **Phase 2.2** - requires coordination but can be parallelized
5. **Phase 3+** - mix of parallel and sequential work

## Key Integration Points:
- Component interfaces (props, state management)
- Keyboard event handling coordination
- State management between panels
- Error handling consistency
- Styling/theming consistency