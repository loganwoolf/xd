import { Box, Text } from "ink";
import type React from "react";

const Footer: React.FC = () => {
	const hotkeys = [
		{ key: "↑/↓", action: "Navigate" },
		{ key: "→", action: "Enter folder" },
		{ key: "←", action: "Parent dir" },
		{ key: "Tab", action: "Switch panel" },
		{ key: "q", action: "Quit" },
		{ key: "Q", action: "Quit & navigate" },
	];

	return (
		<Box borderStyle="single" borderTop paddingX={1}>
			<Box flexDirection="row" justifyContent="space-between">
				{hotkeys.map((hotkey) => (
					<Box key={hotkey.key} marginRight={2}>
						<Text color="yellow">{hotkey.key}</Text>
						<Text color="gray"> {hotkey.action}</Text>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default Footer;
