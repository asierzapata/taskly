import React from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Screen } from '@renderer/ui/screen'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { SplitPane } from '@renderer/ui/split_pane'
import { NotesTree } from '@renderer/features/note_management/notes_tree'
import { type Note } from '@renderer/features/note_management/types'
import { NoteFinder } from '@renderer/features/note_management/note_finder'
import { type Position } from '@orama/plugin-match-highlight'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafeLayout = () => {
	return (
		<Screen>
			<div className="min-h-screen-without-frame max-h-screen-without-frame relative flex w-full transition-all">
				{/* this lib is incompatible with react18. To fix     // children: React.ReactNode; needs to be added to SplitPaneProps.
				// @ts-ignore TS2322 */}
				<SplitPane
					split="vertical"
					defaultSize={250}
					minSize={250}
					maxSize={400}
				>
					<SideBar />
					<Outlet />
				</SplitPane>
			</div>
		</Screen>
	)
}

type SideBarUiStates = 'tree' | 'search'

const SideBar = () => {
	const navigate = useNavigate()
	const { safeId } = useParams()

	const [uiState, setUIState] = React.useState<SideBarUiStates>('tree')

	const handleNoteSelected = React.useCallback(
		(note: Note) => {
			navigate(`/safe/${safeId}/note/${note.id}`)
		},
		[navigate, safeId]
	)

	const handleNotePositionSelected = React.useCallback(
		({ note, position }: { note: Note; position: Position }) => {
			navigate(
				`/safe/${safeId}/note/${note.id}?highlightStart=${
					position.start
				}&highlightEnd=${position.start + position.length}`
			)
		},
		[navigate, safeId]
	)

	return (
		<div className="relative h-full overflow-auto p-3">
			{uiState === 'tree' && (
				<NotesTree
					onNoteSelected={handleNoteSelected}
					onSearch={() => setUIState('search')}
				/>
			)}
			{uiState === 'search' && (
				<NoteFinder
					onBack={() => setUIState('tree')}
					onNoteSelected={handleNoteSelected}
					onNotePositionSelected={handleNotePositionSelected}
				/>
			)}
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafeLayout }
