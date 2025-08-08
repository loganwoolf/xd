import { useCallback, useEffect, useState } from "react";
import { type FileSystemItem, getDirectoryContents } from "../utils/fs.js";
import { getCurrentWorkingDirectory, joinPath } from "../utils/path.js";

export interface DirectoryState {
	currentDirectory: string;
	folders: FileSystemItem[];
	files: FileSystemItem[];
	allItems: FileSystemItem[];
	loading: boolean;
	error: string | null;
}

export function useDirectoryState(initialDirectory?: string) {
	const [state, setState] = useState<DirectoryState>({
		currentDirectory: initialDirectory || getCurrentWorkingDirectory(),
		folders: [],
		files: [],
		allItems: [],
		loading: true,
		error: null,
	});

	const loadDirectory = useCallback(async (path: string) => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const { folders, files, all } = await getDirectoryContents(path);
			setState({
				currentDirectory: path,
				folders,
				files,
				allItems: all,
				loading: false,
				error: null,
			});
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			}));
		}
	}, []);

	const navigateToFolder = useCallback(
		async (folderName: string) => {
			const newPath = joinPath(state.currentDirectory, folderName);
			await loadDirectory(newPath);
		},
		[state.currentDirectory, loadDirectory],
	);

	const navigateToPath = useCallback(
		async (path: string) => {
			await loadDirectory(path);
		},
		[loadDirectory],
	);

	const refresh = useCallback(async () => {
		await loadDirectory(state.currentDirectory);
	}, [state.currentDirectory, loadDirectory]);

	// Load initial directory
	useEffect(() => {
		loadDirectory(state.currentDirectory);
	}, []);

	return {
		...state,
		navigateToFolder,
		navigateToPath,
		refresh,
		loadDirectory,
	};
}
