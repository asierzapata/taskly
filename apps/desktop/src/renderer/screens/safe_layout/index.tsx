import React from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Screen } from '@renderer/ui/screen'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { SplitPane } from '@renderer/ui/split_pane'
import { NotesTree } from '@renderer/features/note_management/notes_tree'
import { type Note } from '@renderer/features/note_management/types'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafeLayout = () => {
	const navigate = useNavigate()
	const { safeId } = useParams()

	const handleNoteSelected = React.useCallback((note: Note) => {
		navigate(`/safe/${safeId}/note/${note.id}`)
	}, [])

	return (
		<Screen>
			<div className="min-h-screen-without-frame max-h-screen-without-frame relative flex w-full transition-all">
				{/* this lib is incompatible with react18. To fix     // children: React.ReactNode; needs to be added to SplitPaneProps.
				// @ts-ignore TS2322 */}
				<SplitPane split="vertical" defaultSize={250} maxSize={400}>
					<div className="relative flex h-full flex-col items-center justify-between rounded-lg shadow-md">
						<div className="w-full flex-1 overflow-y-auto p-3">
							<NotesTree onNoteSelected={handleNoteSelected} />
						</div>
					</div>
					<Outlet />
				</SplitPane>
			</div>
		</Screen>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafeLayout }
