import React from 'react'
import { useAppSelector } from '@renderer/store/hooks'
import { Spinner } from '@taskly/web-ui'
import { Editor, type EditorRef } from '@renderer/editor'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

type NoteEditorProps = {
	id: string
	highlightStart?: number
	highlightEnd?: number
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteEditor = ({ id, highlightStart, highlightEnd }: NoteEditorProps) => {
	const note = useAppSelector(state => state.noteManagement.notes[id])
	const editorRef = React.useRef<EditorRef>(null)
	const [initialContent, setInitialContent] = React.useState('')
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)

	const handleNoteChange = React.useCallback(
		(value: string) => {
			if (!note) return
			void window.api.noteFileSystem.WriteNote({
				path: note.path,
				name: note.name,
				content: value
			})
		},
		[note]
	)

	const handleEditorLoaded = React.useCallback(() => {
		if (highlightStart && highlightEnd) {
			editorRef.current?.highlight(highlightStart, highlightEnd)
		}
	}, [highlightStart, highlightEnd])

	React.useEffect(() => {
		if (!note) return
		void (async () => {
			try {
				const { content } = await window.api.noteFileSystem.ReadNote({
					path: note.path,
					name: note.name
				})

				setInitialContent(content)
				setLoading(false)
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Internal error')
			}
		})()
	}, [note])

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

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteEditor }
