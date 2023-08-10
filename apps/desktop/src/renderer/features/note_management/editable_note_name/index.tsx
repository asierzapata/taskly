import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppSelector } from '@renderer/store/hooks'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@taskly/web-ui'
import { selectNotesOnPath } from '../note_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

type EditableNoteNameProps = {
	noteId: string
	onBlur?: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const EditableNoteName = ({ noteId, onBlur }: EditableNoteNameProps) => {
	const note = useAppSelector(state => state.noteManagement.notes[noteId])
	const noteNamesOnTheSamePath = useAppSelector(
		selectNotesOnPath(note?.path ?? '', noteId)
	)

	const noteNameRef = React.useRef<HTMLDivElement>(null)
	const [noteName] = React.useState(note?.displayName ?? '')

	const [error, setError] = React.useState<
		'required' | 'pattern' | 'isUnique' | null
	>(null)

	const handleValidateNoteName = (event: React.FormEvent<HTMLDivElement>) => {
		if (!note) return
		const div = event.target as HTMLDivElement
		const newNoteName = div.innerText

		if (_.isEmpty(newNoteName)) {
			setError('required')
			return
		}

		if (!/^[\w\-_\s]+$/.test(newNoteName)) {
			setError('pattern')
			return
		}

		if (
			noteNamesOnTheSamePath.some(
				noteName => noteName?.toLowerCase() === newNoteName.toLowerCase()
			)
		) {
			setError('isUnique')
			return
		}

		setError(null)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.currentTarget.blur()
			onBlur?.()
		}
	}

	const handleUpdateNoteName = () => {
		if (!note || !noteNameRef.current) return
		const newNoteName = noteNameRef.current.innerText
		void window.api.noteFileSystem.RenameNote({
			path: note.path,
			oldName: note.name,
			newName: `${newNoteName}.md`
		})
	}

	if (!noteId || !note) {
		return <span className="font-bold text-red-500">Something went wrong!</span>
	}

	return (
		<TooltipProvider>
			<Tooltip open={!_.isEmpty(error)}>
				<TooltipTrigger className="max-w-[-webkit-fill-available] text-left">
					<div
						ref={noteNameRef}
						className="w-full bg-transparent p-2 text-4xl font-extrabold tracking-tight outline-none ring-0 lg:text-5xl"
						contentEditable
						onKeyDown={handleKeyDown}
						onInput={handleValidateNoteName}
						onBlur={handleUpdateNoteName}
						autoFocus
						autoCapitalize="on"
						spellCheck
					>
						{noteName}
					</div>
				</TooltipTrigger>
				{error === 'required' && (
					<TooltipContent variant="danger">Name is required</TooltipContent>
				)}
				{error === 'pattern' && (
					<TooltipContent variant="danger">
						Name can only contain letters, numbers, dashes, underscores and
						spaces
					</TooltipContent>
				)}
				{error === 'isUnique' && (
					<TooltipContent variant="danger">Name must be unique</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { EditableNoteName }
