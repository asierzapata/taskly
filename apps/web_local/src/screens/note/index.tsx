import React, { useEffect } from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useQuery } from '@/lib/router'
import { useNavigate, useParams } from 'react-router-dom'
// import { navigatedToNote } from '@renderer/features/note_management/note_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

// import { NoteNavigation } from '@/features/note_management/note_navigation'
import { EditableNoteName } from '@/features/note_management/editable_note_name'
import { NoteEditor } from '@/features/note_management/note_editor'
import { useFileSystem } from '@/lib/file_system'
import { type FileSystemFile } from '@/lib/file_system/types'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Note = () => {
	const { getNormalizedFiles } = useFileSystem()

	const navigate = useNavigate()
	const { noteId } = useParams()
	const query = useQuery()
	const highlightStart = query.get('highlightStart')
		? parseInt(query.get('highlightStart') ?? '', 10)
		: undefined
	const highlightEnd = query.get('highlightEnd')
		? parseInt(query.get('highlightEnd') ?? '', 10)
		: undefined

	const [note, setNote] = React.useState<FileSystemFile | null>(null)

	const noteEditorRef = React.useRef<HTMLDivElement>(null)

	useEffect(() => {
		const getNote = async () => {
			if (!noteId) return
			const normalizedFiles = await getNormalizedFiles()
			if (!normalizedFiles) {
				navigate(`/home`)
				return
			}
			const note = normalizedFiles[noteId]
			if (!note) {
				navigate(`/home`)
				return
			}
			setNote(note)
		}
		void getNote()
	}, [noteId, getNormalizedFiles, navigate])

	const handleNavigateToNote = ({ noteId }: { noteId: string }) => {
		navigate(`/note/${noteId}`)
	}

	const handleEditableNoteNameBlur = () => {
		if (!noteId) return
		noteEditorRef.current?.focus()
	}

	if (!note) return <span>Something went wrong!</span>

	return (
		<div className="mx-auto w-full max-w-[900px] overflow-y-auto p-6 pt-3">
			{/* <div className="mb-6">
				<NoteNavigation
					noteId={noteId}
					onNavigateToNote={handleNavigateToNote}
				/>
			</div> */}
			<div className="mb-6">
				<EditableNoteName
					key={noteId}
					fileSystemFile={note}
					fileSystemParentFolder={note.parentHandle}
					onBlur={handleEditableNoteNameBlur}
				/>
			</div>
			<NoteEditor
				key={noteId}
				ref={noteEditorRef}
				fileSystemFile={note}
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
