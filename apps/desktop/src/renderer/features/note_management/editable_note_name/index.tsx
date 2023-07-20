import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppSelector } from '@renderer/store/hooks'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const EditableNoteName = ({ noteId }: { noteId: string }) => {
	const note = useAppSelector(state => state.noteManagement.notes[noteId])

	const [noteName, setNoteName] = React.useState('')

	const displayName = note?.displayName ?? ''
	React.useEffect(() => {
		if (!_.isEmpty(displayName) && _.isEmpty(noteName))
			setNoteName(note?.displayName ?? '')
	}, [])

	const handleNoteNameChanged = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!note) return
		console.log(event.target.value)
		const newNoteName = event.target.value
		setNoteName(newNoteName)
		void window.api.noteFileSystem.RenameNote({
			path: note.path,
			oldName: note.name,
			newName: `${newNoteName}.md`
		})
	}

	if (!noteId || !note) return <span>Something went wrong!</span>

	return (
		<input
			className="bg-transparent p-2 text-4xl font-extrabold tracking-tight outline-none ring-0 lg:text-5xl"
			type="text"
			onChange={handleNoteNameChanged}
			value={noteName}
			autoFocus
		/>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { EditableNoteName }
