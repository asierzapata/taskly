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
		console.log('>>>>>>', 'NoteManagementListener')
		const removeFolderCreatedListener =
			window.api.noteFileSystem.OnCreateFolder(data => {
				console.log('>>>>>>', 'folder created')
				dispatch(folderCreated(data))
			})
		const removeDeleteFolderListener = window.api.noteFileSystem.OnDeleteFolder(
			data => {
				console.log('>>>>>>', 'folder deleted')
				dispatch(folderDeleted(data))
			}
		)
		const removeCreateNoteListener = window.api.noteFileSystem.OnCreateNote(
			data => {
				console.log('>>>>>>', 'note created')
				dispatch(noteCreated(data))
			}
		)
		const removeDeleteNoteListener = window.api.noteFileSystem.OnDeleteNote(
			data => {
				console.log('>>>>>>', 'note deleted')
				dispatch(noteDeleted(data))
			}
		)
		const removeRenameNoteListener = window.api.noteFileSystem.OnRenameNote(
			data => {
				console.log('>>>>>>', 'note renamed')
				dispatch(noteRenamed(data))
			}
		)
		const removeRenameFolderListener = window.api.noteFileSystem.OnRenameFolder(
			data => {
				console.log('>>>>>>', 'folder renamed')
				dispatch(folderRenamed(data))
			}
		)
		return () => {
			removeFolderCreatedListener()
			removeDeleteFolderListener()
			removeCreateNoteListener()
			removeDeleteNoteListener()
			removeRenameNoteListener()
			removeRenameFolderListener()
		}
	}, [])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
