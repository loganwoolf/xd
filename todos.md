# Implementation Tasks - Requirements Alignment

## Tree Panel (Left) - Needs Changes
- [x] Change panel title from "Folders" to "folders" (lowercase)
- [x] Show current path at the top of the panel
- [x] List immediate subdirectories of the current directory (not sibling folders)
- [x] Keep the ".." entry for parent navigation

## Contents Panel (Right) - Needs Changes
- [x] Change panel title from "Files" to "contents" (lowercase)
- [x] Create two-column layout: one for folders, one for files
- [x] Add titles to each column ("subfolders" and "files")
- [x] Ensure icons are displayed for directory/file type (already implemented with emojis)

## Interface Structure - Needs Changes
- [x] Restructure layout to show proper directory hierarchy in left panel
- [x] Update right panel to show contents of currently selected directory in tree

## Navigation - Current Implementation Issues
- [x] Fix navigation logic to work with updated tree structure
- [x] Ensure right panel refreshes when selection changes in left panel

## UI/UX Improvements
- [x] Ensure consistent styling with proper borders and spacing
- [ ] Fix active pane highlighting to work with new layout
- [ ] Adjust key bindings if necessary for new navigation structure

## State Management Changes
- [x] Update state to track tree selection separately from contents selection
- [x] Modify directory loading logic to show subdirectories in tree panel

## Key Duplication Issue
- [ ] Fix React key duplication error that's preventing proper rendering

## Raw Mode Issue
- [ ] Fix raw mode issue that's preventing proper keyboard input handling