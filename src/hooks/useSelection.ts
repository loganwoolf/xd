import { useCallback, useState } from "react";

export type Panel = "folders" | "contents";

export interface SelectionState {
	activePanel: Panel;
	foldersIndex: number;
	contentsIndex: number;
}

export function useSelection(initialPanel: Panel = "folders") {
	const [state, setState] = useState<SelectionState>({
		activePanel: initialPanel,
		foldersIndex: 0,
		contentsIndex: 0,
	});

	const switchPanel = useCallback(() => {
		setState((prev) => ({
			...prev,
			activePanel: prev.activePanel === "folders" ? "contents" : "folders",
		}));
	}, []);

	const setActivePanel = useCallback((panel: Panel) => {
		setState((prev) => ({ ...prev, activePanel: panel }));
	}, []);

	const moveSelection = useCallback(
		(direction: "up" | "down", maxIndex: number) => {
			setState((prev) => {
				const currentIndex =
					prev.activePanel === "folders"
						? prev.foldersIndex
						: prev.contentsIndex;
				let newIndex = currentIndex;

				if (direction === "up") {
					newIndex = Math.max(0, currentIndex - 1);
				} else {
					newIndex = Math.min(maxIndex - 1, currentIndex + 1);
				}

				if (prev.activePanel === "folders") {
					return { ...prev, foldersIndex: newIndex };
				} else {
					return { ...prev, contentsIndex: newIndex };
				}
			});
		},
		[],
	);

	const setSelection = useCallback((panel: Panel, index: number) => {
		setState((prev) => {
			if (panel === "folders") {
				return { ...prev, foldersIndex: index };
			} else {
				return { ...prev, contentsIndex: index };
			}
		});
	}, []);

	const resetSelection = useCallback((panel?: Panel) => {
		setState((prev) => {
			if (panel === "folders" || !panel) {
				return { ...prev, foldersIndex: 0 };
			}
			if (panel === "contents" || !panel) {
				return { ...prev, contentsIndex: 0 };
			}
			return prev;
		});
	}, []);

	const getCurrentIndex = useCallback(() => {
		return state.activePanel === "folders"
			? state.foldersIndex
			: state.contentsIndex;
	}, [state.activePanel, state.foldersIndex, state.contentsIndex]);

	return {
		...state,
		switchPanel,
		setActivePanel,
		moveSelection,
		setSelection,
		resetSelection,
		getCurrentIndex,
	};
}
