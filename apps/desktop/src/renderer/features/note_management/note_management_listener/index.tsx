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
			console.log('>>>>>>', 'folder created')
			dispatch(folderCreated(data))
		})
		window.api.noteFileSystem.OnDeleteFolder(data => {
			console.log('>>>>>>', 'folder deleted')
			dispatch(folderDeleted(data))
		})
		window.api.noteFileSystem.OnCreateNote(data => {
			console.log('>>>>>>', 'note created')
			dispatch(noteCreated(data))
		})
		window.api.noteFileSystem.OnDeleteNote(data => {
			console.log('>>>>>>', 'note deleted')
			dispatch(noteDeleted(data))
		})
	}, [])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
