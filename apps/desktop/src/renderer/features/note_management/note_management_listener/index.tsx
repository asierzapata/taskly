import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@renderer/store/hooks'
import {
	folderCreated,
	folderDeleted,
	noteCreated,
	noteDeleted
} from '../note_management_slice'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteManagementListener = () => {
	const dispatch = useAppDispatch()
	React.useEffect(() => {
		window.api.noteFileSystem.OnCreateFolder(data => {
			dispatch(folderCreated(data))
		})
		window.api.noteFileSystem.OnDeleteFolder(data => {
			dispatch(folderDeleted(data))
		})
		window.api.noteFileSystem.OnCreateNote(data => {
			dispatch(noteCreated(data))
		})
		window.api.noteFileSystem.OnDeleteNote(data => {
			dispatch(noteDeleted(data))
		})
	}, [])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
