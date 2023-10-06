import React, { useEffect } from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Outlet } from 'react-router-dom'
import { SplitPane } from '@/ui/split_pane'
// import {
// 	NotesTree,
// 	NotesTreeActions
// } from '@renderer/features/note_management/notes_tree'
// import { type Note } from '@renderer/features/note_management/types'
// import { NoteFinder } from '@renderer/features/note_management/note_finder'
// import { type Position } from '@orama/plugin-match-highlight'
import { Button, Icons } from '@taskly/web-ui'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const HomeLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

	const handleToggleSidebar = () => {
		setIsSidebarOpen(_isSidebarOpen => !_isSidebarOpen)
	}

	return (
		<div className="min-h-screen-without-frame max-h-screen-without-frame relative flex w-full transition-all">
			{isSidebarOpen ? (
				/* this lib is incompatible with react18. To fix     // children: React.ReactNode; needs to be added to SplitPaneProps.
				  // @ts-ignore TS2322 */
				<SplitPane
					split="vertical"
					defaultSize={250}
					minSize={250}
					maxSize={400}
					onResizerDoubleClick={handleToggleSidebar}
				>
					<Sidebar onToggleSidebar={handleToggleSidebar} />
					<Outlet />
				</SplitPane>
			) : (
				<>
					<Button
						variant="ghost"
						size="smallIcon"
						className="group m-3 flex items-center justify-center"
						onClick={handleToggleSidebar}
					>
						<Icons.sidebarOpen className="group-hover:stroke-accent-foreground h-4 w-4" />
					</Button>
					<Outlet />
				</>
			)}
		</div>
	)
}

type SidebarUiStates = 'tree' | 'search'

type SidebarProps = {
	onToggleSidebar: () => void
}

const Sidebar = ({ onToggleSidebar }: SidebarProps) => {
	// const navigate = useNavigate()

	const [uiState, setUIState] = React.useState<SidebarUiStates>('tree')

	// const handleNoteSelected = React.useCallback(
	// 	(note: Note) => {
	// 		navigate(`/safe/${safeId}/note/${note.id}`)
	// 	},
	// 	[navigate, safeId]
	// )

	// const handleNotePositionSelected = React.useCallback(
	// 	({ note, position }: { note: Note; position: Position }) => {
	// 		navigate(
	// 			`/safe/${safeId}/note/${note.id}?highlightStart=${
	// 				position.start
	// 			}&highlightEnd=${position.start + position.length}`
	// 		)
	// 	},
	// 	[navigate, safeId]
	// )

	return (
		<div className="relative h-full overflow-auto p-3">
			{uiState === 'tree' && (
				<>
					<div className="flex flex-row items-center">
						<Button
							variant="ghost"
							size="smallIcon"
							className="group flex items-center justify-center self-start"
							onClick={onToggleSidebar}
						>
							<Icons.sidebarClose className="group-hover:stroke-accent-foreground h-4 w-4" />
						</Button>
						{/* <NotesTreeActions onSearch={() => setUIState('search')} /> */}
					</div>
					{/* <NotesTree onNoteSelected={handleNoteSelected} /> */}
				</>
			)}
			{/* {uiState === 'search' && (
				<NoteFinder
					onBack={() => setUIState('tree')}
					onNoteSelected={handleNoteSelected}
					onNotePositionSelected={handleNotePositionSelected}
				/>
			)} */}
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { HomeLayout }
