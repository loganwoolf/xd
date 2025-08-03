[x] change cwd on exit not working - Mechanism implemented, wrapper script exists
[x] frames should always fit full window height - Added width properties to ensure proper sizing 
[x] only one pane should be active at once where arrow keys can control movement - Implemented focus system with TAB to switch 
[x] when a folder is selected (via arrow up/down) in left pane, that folder's files should be visible in right pane - Implemented folder preview in right pane
[x] remove the path from right pane and replace with just folder name - Simplified UI to show folder names only
[x] if contents would overflow, show a count for how many below at bottom and how many above at top. scroll the view as highlighted item approaches 3 lines from end of container - Implemented scrolling with overflow indicators
[x] full path printed at top of folder frame - Added full paths to both panels
[x] folders on left, current folder's files on right - Reorganized UI layout
[x] key option to show subfolders on right with files - Added 's' key to toggle subfolder view
[x] press space to select file view and allow scrolling contents with arrow keys - Added file viewing mode with scrolling