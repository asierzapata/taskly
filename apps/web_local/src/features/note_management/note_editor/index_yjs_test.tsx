import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Editor, type EditorRef } from '@/editor/index_yjs_test'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { FileSystemFile } from '@/lib/file_system/types'

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
		const editorRef = React.useRef<EditorRef>(null)

		React.useImperativeHandle(ref, () => ({
			focus: () => {
				editorRef.current?.focus()
			}
		}))

		const handleEditorLoaded = React.useCallback(() => {
			if (highlightStart && highlightEnd) {
				editorRef.current?.highlight(highlightStart, highlightEnd)
			}
		}, [highlightStart, highlightEnd])

		return (
			<Editor
				ref={editorRef}
				fileSystemFile={fileSystemFile}
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
