#!/bin/bash

# Run the xd application and capture its output
output=$(bun run /home/logan/code/xd/index.ts 2>/dev/null)

# Check if the output contains our special cwd marker
if [[ $output == __CWD__:* ]]; then
    # Extract the directory path
    new_dir="${output#__CWD__:}"
    # Change to that directory
    cd "$new_dir"
else
    # Just show the output if no directory change was requested
    echo "$output"
fi