#!/usr/bin/env bun
import { render, Text } from "ink";
import type React from "react";

// Create a simple test version that doesn't use useInput
const TestApp: React.FC = () => {
	return (
		<Text>
			<Text bold>File Navigator TUI</Text>
			<Text>This is a test version of the file navigator TUI.</Text>
			<Text>
				To run the full interactive version, you may need to run this in a
				different terminal environment.
			</Text>
		</Text>
	);
};

render(<TestApp />);
