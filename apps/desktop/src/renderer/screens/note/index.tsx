import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { NoteEditor } from '@renderer/features/note_management/note_editor'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Note = () => {
	const { noteId } = useParams()

	if (!noteId) return <span>Something went wrong!</span>

	return (
		<div className="mx-auto w-full max-w-[900px] overflow-y-auto p-6">
			<NoteEditor key={noteId} id={noteId} />
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Note }
