import { homedir } from "node:os";
import { dirname, join, parse, resolve, sep } from "node:path";

export function getCurrentWorkingDirectory(): string {
	return process.cwd();
}

export function getParentDirectory(path: string): string | null {
	const resolved = resolve(path);
	const parent = dirname(resolved);

	// Check if we've reached the filesystem root
	if (parent === resolved) {
		return null;
	}

	return parent;
}

export function joinPath(...segments: string[]): string {
	return join(...segments);
}

export function resolvePath(path: string): string {
	// Handle ~ expansion
	if (path.startsWith("~/")) {
		return join(homedir(), path.slice(2));
	}
	if (path === "~") {
		return homedir();
	}

	return resolve(path);
}

export function isAtRoot(path: string): boolean {
	const resolved = resolve(path);
	const parent = dirname(resolved);
	return parent === resolved;
}

export function truncatePathForDisplay(
	path: string,
	maxLength: number,
): string {
	if (path.length <= maxLength) {
		return path;
	}

	const pathParts = path.split(sep);

	if (pathParts.length <= 2) {
		// If we only have 2 parts or less, just truncate from the end
		return "..." + path.slice(-(maxLength - 3));
	}

	// Try to show the last few directories
	let result = pathParts[pathParts.length - 1];
	let i = pathParts.length - 2;

	while (i >= 0 && result.length + pathParts[i].length + 4 < maxLength) {
		result = pathParts[i] + sep + result;
		i--;
	}

	if (i >= 0) {
		result = "..." + sep + result;
	}

	return result;
}

export function getDirectoryName(path: string): string {
	const parsed = parse(path);
	return parsed.name || parsed.base;
}

export function normalizeDirectoryPath(path: string): string {
	return resolve(path);
}
