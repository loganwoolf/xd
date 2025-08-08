import { Box, Text } from "ink";
import type React from "react";
import type { FileSystemItem } from "../utils/fs.js";
import { truncatePathForDisplay } from "../utils/path.js";

interface ContentsPanelProps {
	selectedIndex: number;
	isActive: boolean;
	visibleItems: FileSystemItem[];
	startIndex: number;
	selectedFolderName?: string;
}

const ContentsPanel: React.FC<ContentsPanelProps> = ({
	selectedIndex,
	isActive,
	visibleItems,
	startIndex,
	selectedFolderName,
}) => {
	const getIcon = (item: FileSystemItem): string => {
		if (item.isDirectory) {
			return "📁";
		}

		// Simple file type detection
		const name = item.name.toLowerCase();
		if (
			name.endsWith(".js") ||
			name.endsWith(".ts") ||
			name.endsWith(".jsx") ||
			name.endsWith(".tsx")
		) {
			return "📄";
		}
		if (
			name.endsWith(".json") ||
			name.endsWith(".yaml") ||
			name.endsWith(".yml")
		) {
			return "📋";
		}
		if (name.endsWith(".md") || name.endsWith(".txt")) {
			return "📝";
		}
		if (
			name.endsWith(".png") ||
			name.endsWith(".jpg") ||
			name.endsWith(".jpeg") ||
			name.endsWith(".gif")
		) {
			return "🖼️";
		}

		return "📄";
	};

	const displayPath = selectedFolderName || "Contents";
	const truncatedPath = truncatePathForDisplay(displayPath, 30);

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
				{truncatedPath}
			</Text>

			<Box flexDirection="column" overflow="hidden">
				{visibleItems.length === 0 ? (
					<Text color="gray" dimColor>
						Empty directory
					</Text>
				) : (
					visibleItems.map((item, index) => {
						const actualIndex = startIndex + index;
						const isSelected = actualIndex === selectedIndex && isActive;
						const displayName = truncatePathForDisplay(item.name, 25);

						return (
							<Box key={`content-${item.name}-${actualIndex}`}>
								<Text
									backgroundColor={isSelected ? "blue" : undefined}
									color={
										isSelected
											? "white"
											: item.isHidden
												? "gray"
												: item.isDirectory
													? "cyan"
													: "white"
									}
									dimColor={item.isHidden}
								>
									{getIcon(item)} {displayName}
								</Text>
							</Box>
						);
					})
				)}

				{/* Fill remaining space if needed */}
				{Array.from(
					{ length: Math.max(0, 16 - visibleItems.length) },
					(_, index) => (
						<Box key={`content-empty-${visibleItems.length + index}`}>
							<Text> </Text>
						</Box>
					),
				)}
			</Box>
		</Box>
	);
};

export default ContentsPanel;
