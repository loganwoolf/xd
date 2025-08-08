import { promises as fs } from "node:fs";

export interface FileSystemItem {
	name: string;
	isDirectory: boolean;
	isFile: boolean;
	isHidden: boolean;
}

export async function readDirectory(path: string): Promise<FileSystemItem[]> {
	try {
		const entries = await fs.readdir(path, { withFileTypes: true });

		return entries.map((entry) => ({
			name: entry.name,
			isDirectory: entry.isDirectory(),
			isFile: entry.isFile(),
			isHidden: entry.name.startsWith("."),
		}));
	} catch (error: unknown) {
		if (error instanceof Error && "code" in error && error.code === "EACCES") {
			throw new Error("inadequate permissions");
		}
		throw error;
	}
}

export async function getDirectoryContents(path: string): Promise<{
	folders: FileSystemItem[];
	files: FileSystemItem[];
	all: FileSystemItem[];
}> {
	const items = await readDirectory(path);

	const folders = items
		.filter((item) => item.isDirectory)
		.sort((a, b) => a.name.localeCompare(b.name));

	const files = items
		.filter((item) => item.isFile)
		.sort((a, b) => a.name.localeCompare(b.name));

	const all = [...folders, ...files];

	return { folders, files, all };
}

export async function isDirectory(path: string): Promise<boolean> {
	try {
		const stats = await fs.stat(path);
		return stats.isDirectory();
	} catch {
		return false;
	}
}

export async function isFile(path: string): Promise<boolean> {
	try {
		const stats = await fs.stat(path);
		return stats.isFile();
	} catch {
		return false;
	}
}

export async function pathExists(path: string): Promise<boolean> {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}
