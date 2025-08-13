import { Box, Text, useApp, useInput, useStdin } from "ink";
import type React from "react";
import { useCallback } from "react";
import { ContentsPanel, FoldersPanel, Footer } from "./components/index.js";
import {
	useDirectoryState,
	useScrolling,
	useSelection,
} from "./hooks/index.js";
import { getParentDirectory, joinPath } from "./utils/path.js";

const App: React.FC = () => {
	const { exit } = useApp();
	const { isRawModeSupported } = useStdin();
	const directoryState = useDirectoryState();
	const selection = useSelection("folders");
	const scrolling = useScrolling();

	// Handle keyboard input - only if raw mode is supported
	useInput(
		useCallback(
			(input, key) => {
				if (!isRawModeSupported) return;
				if (input === "q") {
					exit();
					return;
				}

				if (input === "Q") {
					// Quit and navigate to selected folder
					let targetPath = directoryState.currentDirectory;

					if (selection.activePanel === "folders") {
						const foldersWithCurrent = [
							{
								name: ".",
								isDirectory: true,
								isFile: false,
								isHidden: false,
							},
							...directoryState.folders,
						];
						const selectedFolder = foldersWithCurrent[selection.foldersIndex];
						if (selectedFolder && selectedFolder.name !== ".") {
							targetPath = joinPath(
								directoryState.currentDirectory,
								selectedFolder.name,
							);
						}
					} else {
						const selectedItem =
							directoryState.allItems[selection.contentsIndex];
						if (selectedItem?.isDirectory) {
							targetPath = joinPath(
								directoryState.currentDirectory,
								selectedItem.name,
							);
						}
					}

					// Output the path for shell navigation
					console.log(targetPath);
					exit();
					return;
				}

				if (key.ctrl && input === "c") {
					exit();
					return;
				}

				if (key.tab) {
					selection.switchPanel();
					return;
				}

				if (key.upArrow || key.downArrow) {
					const direction = key.upArrow ? "up" : "down";

					if (selection.activePanel === "folders") {
						const foldersWithCurrent = [
							{
								name: ".",
								isDirectory: true,
								isFile: false,
								isHidden: false,
							},
							...directoryState.folders,
						];
						selection.moveSelection(direction, foldersWithCurrent.length);
						scrolling.updateScrollOffset(
							"folders",
							selection.foldersIndex,
							foldersWithCurrent.length,
						);
					} else {
						selection.moveSelection(direction, directoryState.allItems.length);
						scrolling.updateScrollOffset(
							"contents",
							selection.contentsIndex,
							directoryState.allItems.length,
						);
					}
					return;
				}

				if (key.rightArrow) {
					if (selection.activePanel === "folders") {
						const foldersWithCurrent = [
							{
								name: ".",
								isDirectory: true,
								isFile: false,
								isHidden: false,
							},
							...directoryState.folders,
						];
						const selectedFolder = foldersWithCurrent[selection.foldersIndex];

						if (selectedFolder) {
							if (selectedFolder.name === ".") {
								// Switch to contents panel when selecting current directory
								selection.setActivePanel("contents");
							} else {
								// Navigate to the selected folder
								directoryState.navigateToFolder(selectedFolder.name);
								selection.resetSelection("contents");
								scrolling.resetScrollOffset("contents");
							}
						}
					} else {
						// In contents panel, enter directory if it's a folder
						const selectedItem =
							directoryState.allItems[selection.contentsIndex];
						if (selectedItem?.isDirectory) {
							directoryState.navigateToFolder(selectedItem.name);
							selection.setActivePanel("folders");
							selection.resetSelection();
							scrolling.resetScrollOffset();
						}
					}
					return;
				}

				if (key.leftArrow) {
					if (selection.activePanel === "contents") {
						selection.setActivePanel("folders");
					} else {
						// Go to parent directory
						const parentPath = getParentDirectory(
							directoryState.currentDirectory,
						);
						if (parentPath) {
							directoryState.navigateToPath(parentPath);
							selection.resetSelection();
							scrolling.resetScrollOffset();
						}
					}
					return;
				}
			},
			[exit, directoryState, selection, scrolling, isRawModeSupported],
		),
	);

	// No need for useEffect - scroll updates happen in keyboard handlers

	// Show message if raw mode is not supported
	if (!isRawModeSupported) {
		return (
			<Box flexDirection="column">
				<Box justifyContent="center" alignItems="center" height={20}>
					<Text color="red">
						Raw mode is not supported in this terminal environment.
					</Text>
					<Text color="yellow">
						Try running this application in a proper terminal.
					</Text>
				</Box>
				<Footer />
			</Box>
		);
	}

	if (directoryState.loading) {
		return (
			<Box flexDirection="column">
				<Box justifyContent="center" alignItems="center" height={20}>
					<Text>Loading...</Text>
				</Box>
				<Footer />
			</Box>
		);
	}

	if (directoryState.error) {
		return (
			<Box flexDirection="column">
				<Box justifyContent="center" alignItems="center" height={20}>
					<Text color="red">Error: {directoryState.error}</Text>
				</Box>
				<Footer />
			</Box>
		);
	}

	// Prepare data for panels
	const foldersWithCurrent = [
		{ name: ".", isDirectory: true, isFile: false, isHidden: false },
		...directoryState.folders,
	];

	const visibleFolders = scrolling.getVisibleItems(
		foldersWithCurrent,
		"folders",
	);
	const visibleContents = scrolling.getVisibleItems(
		directoryState.allItems,
		"contents",
	);

	const selectedFolderName =
		selection.activePanel === "folders"
			? foldersWithCurrent[selection.foldersIndex]?.name
			: undefined;

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<FoldersPanel
					currentDirectory={directoryState.currentDirectory}
					folders={directoryState.folders}
					selectedIndex={selection.foldersIndex}
					isActive={selection.activePanel === "folders"}
					visibleItems={visibleFolders.items}
					startIndex={visibleFolders.startIndex}
				/>
				<ContentsPanel
					selectedIndex={selection.contentsIndex}
					isActive={selection.activePanel === "contents"}
					visibleItems={visibleContents.items}
					startIndex={visibleContents.startIndex}
					selectedFolderName={
						selectedFolderName === "."
							? "Current Directory"
							: selectedFolderName
					}
				/>
			</Box>
			<Footer />
		</Box>
	);
};

export default App;
