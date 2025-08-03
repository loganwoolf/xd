import fs from "node:fs";
import path from "node:path";
import { Box, Text, useApp, useInput } from "ink";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface FileItem {
	name: string;
	path: string;
	isDirectory: boolean;
}

const App: React.FC = () => {
	const { exit } = useApp();
	const [currentPath, setCurrentPath] = useState(process.cwd());
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const [currentDirectoryFiles, setCurrentDirectoryFiles] = useState<
		FileItem[]
	>([]);

	// Load directory contents
	const loadDirectory = useCallback((dirPath: string) => {
		try {
			const items = fs.readdirSync(dirPath, { withFileTypes: true });
			const fileItems: FileItem[] = items
				.map((item) => ({
					name: item.name,
					path: path.join(dirPath, item.name),
					isDirectory: item.isDirectory(),
				}))
				.sort((a, b) => {
					// Directories first, then files, both sorted alphabetically
					if (a.isDirectory && !b.isDirectory) return -1;
					if (!a.isDirectory && b.isDirectory) return 1;
					return a.name.localeCompare(b.name);
				});

			return fileItems;
		} catch (error) {
			console.error("Error reading directory:", error);
			return [];
		}
	}, []);

	// Update current directory files when current path changes
	useEffect(() => {
		const files = loadDirectory(currentPath);
		setCurrentDirectoryFiles(files);
		setSelectedItemIndex(0); // Reset selection when directory changes
	}, [currentPath, loadDirectory]);

	// Handle keyboard input
	useInput((input, key) => {
		// Exit on Ctrl+C or 'q'
		if ((input === "c" && key.ctrl) || input === "q") {
			// Output the final directory to stdout so a wrapper script can use it
			console.log(`__CWD__:${currentPath}`);
			exit();
		}

		// Jump to home directory on 'H'
		if (input === "H") {
			const homeDir =
				process.env.HOME || process.env.USERPROFILE || process.cwd();
			if (homeDir) {
				setCurrentPath(homeDir);
			}
		}

		// Navigation
		if (key.upArrow && currentDirectoryFiles.length > 0) {
			setSelectedItemIndex((prev) => Math.max(0, prev - 1));
		}

		if (key.downArrow && currentDirectoryFiles.length > 0) {
			setSelectedItemIndex((prev) =>
				Math.min(currentDirectoryFiles.length - 1, prev + 1),
			);
		}

		if (key.leftArrow) {
			// Go to parent directory
			const parentPath = path.dirname(currentPath);
			if (parentPath !== currentPath) {
				setCurrentPath(parentPath);
			}
		}

		if (
			(key.rightArrow || input === "\r" || input === "\n") &&
			currentDirectoryFiles.length > 0
		) {
			// Enter selected directory
			if (selectedItemIndex < currentDirectoryFiles.length) {
				const selectedItem = currentDirectoryFiles[selectedItemIndex];
				if (selectedItem.isDirectory) {
					setCurrentPath(selectedItem.path);
				}
			}
		}
	});

	return (
		<Box flexDirection="column" height="100%">
			<Box flexDirection="row" flexGrow={1}>
				{/* Left panel - Current directory contents */}
				<Box
					flexDirection="column"
					width="50%"
					borderStyle="single"
					padding={1}
					height="100%"
				>
					<Text bold>Current Directory: {currentPath}</Text>
					<Box flexDirection="column" marginTop={1} flexGrow={1}>
						{currentDirectoryFiles.map((item, index) => (
							<Box key={`${item.name}-${index}`}>
								<Text
									color={index === selectedItemIndex ? "blue" : undefined}
									bold={index === selectedItemIndex}
								>
									{item.isDirectory ? "📁 " : "📄 "}
									{item.name}
								</Text>
							</Box>
						))}
					</Box>
				</Box>

				{/* Right panel - Parent directory contents */}
				<Box
					flexDirection="column"
					width="50%"
					borderStyle="single"
					padding={1}
					height="100%"
				>
					<Text bold>Parent Directory</Text>
					<Box flexDirection="column" marginTop={1} flexGrow={1}>
						{(() => {
							const parentPath = path.dirname(currentPath);
							const parentFiles = loadDirectory(parentPath);
							const currentDirName = path.basename(currentPath);

							return parentFiles.map((item, index) => (
								<Box key={`${item.name}-${index}`}>
									<Text
										color={item.name === currentDirName ? "blue" : undefined}
										bold={item.name === currentDirName}
									>
										{item.isDirectory ? "📁 " : "📄 "}
										{item.name}
									</Text>
								</Box>
							));
						})()}
					</Box>
				</Box>
			</Box>

			{/* Key commands footer */}
			<Box
				flexDirection="row"
				justifyContent="center"
				padding={1}
				borderTop={true}
			>
				<Text>
					↑/↓: Navigate | ←: Parent | →/Enter: Enter | H: Home | q/Ctrl+C: Quit
				</Text>
			</Box>
		</Box>
	);
};

export default App;
