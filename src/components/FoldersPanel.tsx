import { Box, Text } from "ink";
import type React from "react";
import type { FileSystemItem } from "../utils/fs.js";
import { truncatePathForDisplay } from "../utils/path.js";

interface FoldersPanelProps {
	currentDirectory: string;
	folders: FileSystemItem[];
	selectedIndex: number;
	isActive: boolean;
	visibleItems: FileSystemItem[];
	startIndex: number;
}

const FoldersPanel: React.FC<FoldersPanelProps> = ({
	currentDirectory,
	folders,
	selectedIndex,
	isActive,
	visibleItems,
	startIndex,
}) => {
	const displayPath = truncatePathForDisplay(currentDirectory, 30);

	// Add the "." entry for current directory at the beginning
	const _foldersWithCurrent = [
		{ name: ".", isDirectory: true, isFile: false, isHidden: false },
		...folders,
	];

	return (
		<Box
			flexDirection="column"
			borderStyle="single"
			borderColor={isActive ? "yellow" : "gray"}
			height={18}
			width="50%"
			paddingX={1}
		>
			<Text color="cyan" bold>
				Folders: {displayPath}
			</Text>

			<Box flexDirection="column" overflow="hidden">
				{visibleItems.map((folder, index) => {
					const actualIndex = startIndex + index;
					const isSelected = actualIndex === selectedIndex && isActive;

					return (
						<Box key={`folder-${folder.name}-${actualIndex}`}>
							<Text
								backgroundColor={isSelected ? "blue" : undefined}
								color={
									isSelected ? "white" : folder.name === "." ? "green" : "gray"
								}
							>
								📁 {folder.name}
							</Text>
						</Box>
					);
				})}

				{/* Fill remaining space if needed */}
				{Array.from(
					{ length: Math.max(0, 16 - visibleItems.length) },
					(_, index) => (
						<Box key={`folder-empty-${visibleItems.length + index}`}>
							<Text> </Text>
						</Box>
					),
				)}
			</Box>
		</Box>
	);
};

export default FoldersPanel;
