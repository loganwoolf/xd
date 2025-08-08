#!/bin/bash

# Get the directory of this script to find the xd application
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the xd application and capture its output
output=$("$SCRIPT_DIR/xd" 2>/dev/null)

# If output is not empty and represents a valid directory path, cd to it
if [[ -n "$output" && -d "$output" ]]; then
    cd "$output"
    echo "Changed directory to: $output"
else
    # If no valid directory output, just run normally (user pressed 'q' instead of 'Q')
    "$SCRIPT_DIR/xd"
fi