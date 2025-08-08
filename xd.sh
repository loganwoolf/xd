#!/bin/bash

# Get the directory of this script to find the xd application
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the xd application and capture its output
output=$(cd "$SCRIPT_DIR" && bun run index.ts 2>/dev/null)

# If output is not empty and represents a valid directory path, cd to it
if [[ -n "$output" && -d "$output" ]]; then
    cd "$output"
    echo "Changed directory to: $output"
else
    # If no valid directory output, just run normally (user pressed 'q' instead of 'Q')
    cd "$SCRIPT_DIR" && bun run index.ts
fi