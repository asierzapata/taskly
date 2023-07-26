import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useQuery } from '@renderer/lib/router'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { useNavigate, useParams } from 'react-router-dom'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { NoteNavigation } from '@renderer/features/note_management/note_navigation'
import { EditableNoteName } from '@renderer/features/note_management/editable_note_name'
import { NoteEditor } from '@renderer/features/note_management/note_editor'
import { navigatedToNote } from '@renderer/features/note_management/note_management_slice'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Note = () => {
	const navigate = useNavigate()
	const { noteId, safeId } = useParams()
	const query = useQuery()
	const highlightStart = query.get('highlightStart')
		? parseInt(query.get('highlightStart') ?? '', 10)
		: undefined
	const highlightEnd = query.get('highlightEnd')
		? parseInt(query.get('highlightEnd') ?? '', 10)
		: undefined

	const dispatch = useAppDispatch()

	const note = useAppSelector(state =>
		noteId ? state.noteManagement.notes[noteId] : {}
	)

	React.useEffect(() => {
		if (_.isEmpty(note)) {
			navigate(`/safe/${safeId}`)
		}
	}, [navigate, note, safeId])

	React.useEffect(() => {
		if (!noteId) return
		dispatch(
			navigatedToNote({
				noteId
			})
		)
	}, [noteId])

	const handleNavigateToNote = ({ noteId }: { noteId: string }) => {
		navigate(`/safe/${safeId}/note/${noteId}`)
	}

	if (!noteId) return <span>Something went wrong!</span>

	return (
		<div className="mx-auto w-full max-w-[900px] overflow-y-auto p-6 pt-3">
			<div className="mb-6">
				<NoteNavigation
					noteId={noteId}
					onNavigateToNote={handleNavigateToNote}
				/>
			</div>
			<div className="mb-6">
				<EditableNoteName key={noteId} noteId={noteId} />
			</div>
			<NoteEditor
				key={noteId}
				id={noteId}
				highlightStart={highlightStart}
				highlightEnd={highlightEnd}
			/>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Note }
