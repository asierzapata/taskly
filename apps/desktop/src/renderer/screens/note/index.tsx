import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import { NoteEditor } from '@renderer/features/note_management/note_editor'
import { H1 } from '@taskly/web-ui'
import { useAppSelector } from '@renderer/store/hooks'
import _ from 'lodash'

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
	const navigate = useNavigate()
	const { noteId, safeId } = useParams()
	const note = useAppSelector(state =>
		noteId
			? state.noteManagement.notes[noteId]
			: {
					name: null
			  }
	)

	React.useEffect(() => {
		if (_.isEmpty(note)) {
			navigate(`/safe/${safeId}`)
		}
	}, [])

	if (!noteId) return <span>Something went wrong!</span>

	return (
		<div className="mx-auto w-full max-w-[900px] overflow-y-auto p-6 pt-12">
			<div className="mb-6">
				<H1>{note?.name}</H1>
			</div>
			<NoteEditor key={noteId} id={noteId} />
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Note }
