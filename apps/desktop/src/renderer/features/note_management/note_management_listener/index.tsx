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
	noteRenamed,
	selectNote
} from '../note_management_slice'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteManagementListener = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { safeId } = useParams()

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
				console.log('>>>>>>', 'removeCreateNoteListener', data)
				void dispatch(noteCreated(data)).then(({ payload }) => {
					if (!safeId || typeof payload === 'string' || !payload?.note) return
					const { note } = payload
					const noteFullPath = note?.path.endsWith('/')
						? `${note.path}${note.name}`
						: `${note?.path}/${note?.name}`
					dispatch(selectNote({ path: noteFullPath }))
					navigate(`/safe/${safeId}/note/${note.id}`)
				})
			}
		)
		const removeDeleteNoteListener = window.api.noteFileSystem.OnDeleteNote(
			data => {
				void dispatch(noteDeleted(data))
			}
		)
		const removeRenameNoteListener = window.api.noteFileSystem.OnRenameNote(
			data => {
				void dispatch(noteRenamed(data))
			}
		)
		const removeRenameFolderListener = window.api.noteFileSystem.OnRenameFolder(
			data => {
				dispatch(folderRenamed(data))
			}
		)
		const removeWriteNoteListener = window.api.noteFileSystem.OnWriteNote(
			data => {
				void dispatch(noteContentUpdated(data))
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
	}, [dispatch, navigate, safeId])

	return <Outlet />
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteManagementListener }
