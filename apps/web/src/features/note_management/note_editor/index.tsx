import React from 'react'

import { useFileSystem } from '@/lib/file_system'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Editor, type EditorRef } from '@/editor'
import { Spinner } from '@taskly/web-ui'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import { type FileSystemFile } from '@/lib/file_system/types'

type NoteEditorProps = {
	fileSystemFile: FileSystemFile
	highlightStart?: number
	highlightEnd?: number
}

export type NoteEditorRef = {
	focus: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteEditor = React.forwardRef<NoteEditorRef, NoteEditorProps>(
	({ fileSystemFile, highlightStart, highlightEnd }, ref) => {
		const { updateFileContent } = useFileSystem()

		const editorRef = React.useRef<EditorRef>(null)
		const [initialContent, setInitialContent] = React.useState('')
		const [loading, setLoading] = React.useState(true)
		const [error, setError] = React.useState<string | null>(null)

		React.useImperativeHandle(ref, () => ({
			focus: () => {
				editorRef.current?.focus()
			}
		}))

		const handleNoteChange = React.useCallback(
			(value: string) => {
				void (async () => {
					try {
						const file = await fileSystemFile.handle.getFile()
						await updateFileContent(file, fileSystemFile.handle, value)
					} catch (error) {
						setError(error instanceof Error ? error.message : 'Internal error')
					}
				})()
			},
			[fileSystemFile.handle, updateFileContent]
		)

		const handleEditorLoaded = React.useCallback(() => {
			if (highlightStart && highlightEnd) {
				editorRef.current?.highlight(highlightStart, highlightEnd)
			}
		}, [highlightStart, highlightEnd])

		React.useEffect(() => {
			void (async () => {
				try {
					const file = await fileSystemFile.handle.getFile()
					const content = await file.text()

					setInitialContent(content)
					setLoading(false)
				} catch (error) {
					setError(error instanceof Error ? error.message : 'Internal error')
				}
			})()
		}, [fileSystemFile.handle])

		if (error)
			return (
				<div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
					<span>Something went wrong!</span>
					<span className="text-red-500">{error}</span>
				</div>
			)

		if (loading)
			return (
				<div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
					<span>Reading note...</span>
					<Spinner />
				</div>
			)

		return (
			<Editor
				ref={editorRef}
				initialDocument={initialContent}
				onChange={handleNoteChange}
				onLoaded={handleEditorLoaded}
			/>
		)
	}
)

NoteEditor.displayName = 'NoteEditor'

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteEditor }
