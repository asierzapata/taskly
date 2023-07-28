import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, Icons } from '@taskly/web-ui'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { navigatedBack, navigatedForward } from '../note_management_slice'
import { useNavigate } from 'react-router-dom'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

type NoteNavigationProps = {
	noteId: string
	onNavigateToNote: ({ noteId }: { noteId: string }) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteNavigation = ({ noteId, onNavigateToNote }: NoteNavigationProps) => {
	const dispatch = useAppDispatch()
	const note = useAppSelector(state =>
		noteId
			? state.noteManagement.notes[noteId]
			: {
					path: null,
					displayName: null
			  }
	)
	const noteNavigationStack = useAppSelector(
		state => state.noteManagement.noteNavigation.stack
	)
	const currentNoteNavigationIndex = useAppSelector(
		state => state.noteManagement.noteNavigation.currentStackIndex
	)

	const handleNavigateBack = () => {
		const noteIdToNavigateTo =
			noteNavigationStack[currentNoteNavigationIndex - 1]
		if (!noteIdToNavigateTo) {
			return
		}
		dispatch(navigatedBack())
		onNavigateToNote({
			noteId: noteIdToNavigateTo
		})
	}

	const handleNavigateForward = () => {
		const noteIdToNavigateTo =
			noteNavigationStack[currentNoteNavigationIndex + 1]
		if (!noteIdToNavigateTo) {
			return
		}
		dispatch(navigatedForward())
		onNavigateToNote({
			noteId: noteIdToNavigateTo
		})
	}

	return (
		<div className="flex">
			<Button
				variant="ghost"
				size="smallIcon"
				className="group mr-2 flex items-center justify-center"
				onClick={handleNavigateBack}
				disabled={currentNoteNavigationIndex === 0}
			>
				<Icons.chevronLeft className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="smallIcon"
				className="group mr-4 flex items-center justify-center"
				onClick={handleNavigateForward}
				disabled={
					noteNavigationStack.length === 0 ||
					currentNoteNavigationIndex === noteNavigationStack.length - 1
				}
			>
				<Icons.chevronRight className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
			{note?.path ? (
				<div className="flex-1 select-none">
					<span className="text-muted-foreground text-sm">
						{_.tail(note.path.replace(/\\/g, '/'))}/
					</span>
					<span className="text-sm font-bold">{note.displayName}</span>
				</div>
			) : null}
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteNavigation }
