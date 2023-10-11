import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@taskly/web-ui'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import type { FileSystemFile } from '@/lib/file_system/types'
import { useFileSystem } from '@/lib/file_system'

type EditableNoteNameProps = {
	fileSystemFile: FileSystemFile
	fileSystemParentFolder: FileSystemDirectoryHandle
	onBlur?: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const EditableNoteName = ({
	fileSystemFile,
	onBlur
}: EditableNoteNameProps) => {
	const { getDirectoryEntries, renameFile } = useFileSystem()
	const [noteNamesOnSamePath, setNoteNamesOnSamePath] = useState<string[]>([])

	const noteNameRef = useRef<HTMLDivElement>(null)

	console.log('>>>>>>', {
		fileSystemFile,
		noteName: fileSystemFile.formatedName
	})

	const [error, setError] = useState<
		'required' | 'pattern' | 'isUnique' | null
	>(null)

	useEffect(() => {
		const load = async () => {
			const handles = await getDirectoryEntries(fileSystemFile.parentHandle)
			const noteNames = handles
				.filter(
					h => h.kind === 'file' && h.name !== fileSystemFile.formatedName
				)
				.map(h => h.name)
			setNoteNamesOnSamePath(noteNames)
		}
		void load()
	}, [
		fileSystemFile.formatedName,
		fileSystemFile.parentHandle,
		getDirectoryEntries
	])

	const handleValidateNoteName = (event: React.FormEvent<HTMLDivElement>) => {
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
			noteNamesOnSamePath.some(
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
		void (async () => {
			if (!noteNameRef.current) return
			const newNoteName = noteNameRef.current.innerText
			const fileExtension = fileSystemFile.name.split('.').pop()
			const newNoteNameWithExtension = `${newNoteName}.${fileExtension}`
			const file = await fileSystemFile.handle.getFile()
			void renameFile(
				file,
				fileSystemFile.parentHandle,
				newNoteNameWithExtension
			)
		})()
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
						{fileSystemFile.formatedName}
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
