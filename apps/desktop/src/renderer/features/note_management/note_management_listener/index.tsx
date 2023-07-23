import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@renderer/store/hooks'
import {
	folderCreated,
	folderDeleted,
	folderRenamed,
	noteContentUpdated,
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
		const removeFolderCreatedListener =
			window.api.noteFileSystem.OnCreateFolder(data => {
				dispatch(folderCreated(data))
			})
		const removeDeleteFolderListener = window.api.noteFileSystem.OnDeleteFolder(
			data => {
				dispatch(folderDeleted(data))
			}
		)
		const removeCreateNoteListener = window.api.noteFileSystem.OnCreateNote(
			data => {
				dispatch(noteCreated(data))
			}
		)
		const removeDeleteNoteListener = window.api.noteFileSystem.OnDeleteNote(
			data => {
				dispatch(noteDeleted(data))
			}
		)
		const removeRenameNoteListener = window.api.noteFileSystem.OnRenameNote(
			data => {
				dispatch(noteRenamed(data))
			}
		)
		const removeRenameFolderListener = window.api.noteFileSystem.OnRenameFolder(
			data => {
				dispatch(folderRenamed(data))
			}
		)
		const removeWriteNoteListener = window.api.noteFileSystem.OnWriteNote(
			data => {
				dispatch(noteContentUpdated(data))
			}
		)
		return () => {
			removeFolderCreatedListener()
			removeDeleteFolderListener()
			removeCreateNoteListener()
			removeDeleteNoteListener()
			removeRenameNoteListener()
			removeRenameFolderListener()
			removeWriteNoteListener()
		}
	}, [])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
