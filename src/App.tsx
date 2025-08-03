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
	const [showSubfolders, setShowSubfolders] = useState(false);
	const [fileViewMode, setFileViewMode] = useState(false);
	const [fileContent, setFileContent] = useState<string[]>([]);
	const [fileViewPosition, setFileViewPosition] = useState(0);

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

	// Separate folders and files
	const folders = currentDirectoryFiles.filter(item => item.isDirectory);
	const files = currentDirectoryFiles.filter(item => !item.isDirectory);
	
	// Read file content
	const readFileContent = useCallback((filePath: string) => {
		try {
			const content = fs.readFileSync(filePath, 'utf8');
			return content.split('\n');
		} catch (error) {
			console.error("Error reading file:", error);
			return ["Error reading file"];
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
		if (fileViewMode) {
			// File view mode navigation
			if (input === " " || (input === "c" && key.ctrl) || input === "q") {
				// Exit file view mode
				setFileViewMode(false);
				setFileContent([]);
				setFileViewPosition(0);
			} else if (key.upArrow) {
				// Scroll up in file content
				setFileViewPosition(prev => Math.max(0, prev - 1));
			} else if (key.downArrow) {
				// Scroll down in file content
				setFileViewPosition(prev => Math.min(Math.max(0, fileContent.length - 10), prev + 1));
			}
		} else {
			// Normal navigation mode
			// Exit on Ctrl+C or 'q' (temporary test: exit immediately for testing)
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

			// Toggle subfolder view on 's'
			if (input === "s" || input === "S") {
				setShowSubfolders(!showSubfolders);
			}

			// Toggle file view mode on space
			if (input === " " && files.length > 0) {
				const effectiveFiles = (showSubfolders && folders.length > 0 && selectedItemIndex < folders.length 
					? loadDirectory(folders[selectedItemIndex].path)
					: files
				);
				if (selectedItemIndex < effectiveFiles.length) {
					const selectedItem = effectiveFiles[selectedItemIndex];
					if (!selectedItem.isDirectory) {
						setFileViewMode(true);
						const content = readFileContent(selectedItem.path);
						setFileContent(content);
						setFileViewPosition(0);
					}
				}
			}

			// Navigation
			if (key.upArrow && folders.length > 0) {
				setSelectedItemIndex((prev) => Math.max(0, prev - 1));
			}

			if (key.downArrow && folders.length > 0) {
				setSelectedItemIndex((prev) =>
					Math.min(folders.length - 1, prev + 1),
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
				folders.length > 0
			) {
				// Enter selected directory
				if (selectedItemIndex < folders.length) {
					const selectedItem = folders[selectedItemIndex];
					if (selectedItem.isDirectory) {
						setCurrentPath(selectedItem.path);
					}
				}
			}
		}
	});

	return (
		<Box flexDirection="column" height="100%" width="100%">
			{fileViewMode ? (
				// File view mode
				<Box flexDirection="column" height="100%" width="100%">
					<Text bold>File Content (Press SPACE to exit view mode)</Text>
					<Box flexDirection="column" marginTop={1} flexGrow={1}>
						{fileContent.slice(fileViewPosition, fileViewPosition + 20).map((line, index) => (
							<Text key={index}>{line}</Text>
						))}
					</Box>
				</Box>
			) : (
				// Normal directory view mode
				<Box flexDirection="column" height="100%" width="100%">
					<Box flexDirection="row" flexGrow={1}>
						{/* Left panel - Folders in current directory */}
						<Box
							flexDirection="column"
							width="50%"
							borderStyle="single"
							padding={1}
							height="100%"
						>
							<Text bold>Folders</Text>
							<Text>{currentPath}</Text>
							<Box flexDirection="column" marginTop={1} flexGrow={1}>
								{folders.map((item, index) => (
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

						{/* Right panel - Files in current directory (and subfolders if toggled) */}
						<Box
							flexDirection="column"
							width="50%"
							borderStyle="single"
							padding={1}
							height="100%"
						>
							<Text bold>Files{showSubfolders ? " and Subfolders" : ""}</Text>
							<Text>{currentPath}</Text>
							<Box flexDirection="column" marginTop={1} flexGrow={1}>
								{(showSubfolders && folders.length > 0 && selectedItemIndex < folders.length 
								  ? loadDirectory(folders[selectedItemIndex].path)
								  : files
								).map((item, index) => (
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
					</Box>

					{/* Key commands footer */}
					<Box
						flexDirection="row"
						justifyContent="center"
						padding={1}
						borderTop={true}
					>
						<Text>
							↑/↓: Navigate | ←: Parent | →/Enter: Enter | H: Home | S: Subfolders | SPACE: View File | q/Ctrl+C: Quit
						</Text>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default App;
