import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@renderer/store/hooks'
import {
	folderCreated,
	folderDeleted,
	folderRenamed,
	noteCreated,
	noteDeleted,
	noteRenamed
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
		window.api.noteFileSystem.OnRenameNote(data => {
			console.log('>>>>>>', 'note renamed')
			dispatch(noteRenamed(data))
		})
		window.api.noteFileSystem.OnRenameFolder(data => {
			console.log('>>>>>>', 'folder renamed')
			dispatch(folderRenamed(data))
		})
	}, [])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
