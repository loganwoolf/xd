import { useCallback, useEffect, useState } from "react";

export interface ScrollState {
	foldersOffset: number;
	contentsOffset: number;
}

const PANEL_HEIGHT = 16;
const SCROLL_TRIGGER = 3;

export function useScrolling() {
	const [scrollState, setScrollState] = useState<ScrollState>({
		foldersOffset: 0,
		contentsOffset: 0,
	});

	const calculateScrollOffset = useCallback(
		(
			selectedIndex: number,
			currentOffset: number,
			totalItems: number,
		): number => {
			if (totalItems <= PANEL_HEIGHT) {
				return 0;
			}

			const visibleStart = currentOffset;
			const visibleEnd = currentOffset + PANEL_HEIGHT - 1;

			// If selection is too close to the bottom of visible area, scroll down
			if (selectedIndex >= visibleEnd - SCROLL_TRIGGER) {
				const newOffset = Math.min(
					selectedIndex - PANEL_HEIGHT + SCROLL_TRIGGER + 1,
					totalItems - PANEL_HEIGHT,
				);
				return Math.max(0, newOffset);
			}

			// If selection is too close to the top of visible area, scroll up
			if (selectedIndex <= visibleStart + SCROLL_TRIGGER) {
				const newOffset = Math.max(0, selectedIndex - SCROLL_TRIGGER);
				return newOffset;
			}

			return currentOffset;
		},
		[],
	);

	const updateScrollOffset = useCallback(
		(
			panel: "folders" | "contents",
			selectedIndex: number,
			totalItems: number,
		) => {
			setScrollState((prev) => {
				const currentOffset =
					panel === "folders" ? prev.foldersOffset : prev.contentsOffset;
				const newOffset = calculateScrollOffset(
					selectedIndex,
					currentOffset,
					totalItems,
				);

				if (panel === "folders") {
					return { ...prev, foldersOffset: newOffset };
				} else {
					return { ...prev, contentsOffset: newOffset };
				}
			});
		},
		[calculateScrollOffset],
	);

	const resetScrollOffset = useCallback((panel?: "folders" | "contents") => {
		setScrollState((prev) => {
			if (panel === "folders") {
				return { ...prev, foldersOffset: 0 };
			} else if (panel === "contents") {
				return { ...prev, contentsOffset: 0 };
			} else {
				return { foldersOffset: 0, contentsOffset: 0 };
			}
		});
	}, []);

	const getVisibleItems = useCallback(
		<T>(
			items: T[],
			panel: "folders" | "contents",
		): { items: T[]; startIndex: number } => {
			const offset =
				panel === "folders"
					? scrollState.foldersOffset
					: scrollState.contentsOffset;
			const visibleItems = items.slice(offset, offset + PANEL_HEIGHT);
			return {
				items: visibleItems,
				startIndex: offset,
			};
		},
		[scrollState.foldersOffset, scrollState.contentsOffset],
	);

	return {
		...scrollState,
		updateScrollOffset,
		resetScrollOffset,
		getVisibleItems,
		panelHeight: PANEL_HEIGHT,
	};
}
