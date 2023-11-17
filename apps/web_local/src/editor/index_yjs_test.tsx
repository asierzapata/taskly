import React, { useRef, useEffect, useImperativeHandle } from 'react'
import {
	EditorView,
	highlightSpecialChars,
	drawSelection,
	scrollPastEnd,
	dropCursor
} from '@codemirror/view'
import { EditorSelection, EditorState } from '@codemirror/state'

import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'

// Extensions
// ----------

import {
	indentOnInput,
	foldGutter,
	bracketMatching
} from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { highlightSelectionMatches, search } from '@codemirror/search'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { history } from '@codemirror/commands'
import { blockquote } from './plugins/blockquote'
import { codeblock } from './plugins/code-block'
import { headings } from './plugins/heading'
import { hideMarks } from './plugins/hide-mark'
import { htmlBlock } from './plugins/html'
import { image } from './plugins/image'
import { links } from './plugins/link'
import { lists } from './plugins/list'
import { headingSlugField } from './state/heading-slug'
import { imagePreview } from './state/image'
import { frontmatter } from './plugins/frontmatter'

// Theme
// -----

import { EditorTheme } from './theme'
import { keymaps } from './keymap'

// Types
// -----

import type { FileSystemFile } from '@/lib/file_system/types'
import { useFileSync } from '@/lib/file_system'
import { IndexeddbPersistence } from 'y-indexeddb'

type EditorProps = {
	fileSystemFile: FileSystemFile
	editorViewRef?: React.MutableRefObject<EditorView>
	onLoaded?: () => void
}

export type EditorRef = {
	getValue: () => string | undefined
	highlight: (start: number, end: number) => void
	focus: () => void
}

// Component
// ---------

const Editor = React.forwardRef<EditorRef, EditorProps>(
	({ editorViewRef: editorViewRefProp, fileSystemFile, onLoaded }, ref) => {
		const editorViewRefInternal = useRef<EditorView>()
		const containerRef = useRef<HTMLDivElement | null>(null)
		const yDocRef = useRef<Y.Doc>(new Y.Doc())
		const indexeddbPersistenceRef = useRef<IndexeddbPersistence>()

		const { syncDoc } = useFileSync()

		const editorViewRef = editorViewRefProp || editorViewRefInternal

		useImperativeHandle(ref, () => ({
			getValue: () => editorViewRef.current?.state.doc.toString(),
			highlight: (start: number, end: number) => {
				editorViewRef.current?.dispatch({
					selection: EditorSelection.range(start, end),
					scrollIntoView: true
				})
			},
			focus: () => {
				console.log('>>>>>>', 'FOCUS')
				editorViewRef.current?.focus()
			}
		}))

		useEffect(() => {
			const load = async () => {
				if (containerRef.current) {
					if (!editorViewRef.current) {
						// Y.js
						indexeddbPersistenceRef.current = new IndexeddbPersistence(
							fileSystemFile.name,
							yDocRef.current
						)

						await syncDoc({
							doc: yDocRef.current,
							name: fileSystemFile.name,
							directoryHandle: fileSystemFile.parentHandle
						})

						const yText = yDocRef.current.getText()

						console.log('>>>>>>', 'YJS', yText.toString())

						const extensions = [
							highlightSpecialChars(),
							history(),
							foldGutter(),
							drawSelection(),
							EditorState.allowMultipleSelections.of(true),
							indentOnInput(),
							bracketMatching(),
							closeBrackets(),
							autocompletion(),
							highlightSelectionMatches(),
							highlightSpecialChars(),
							scrollPastEnd(),
							dropCursor(),
							search(),
							keymaps(),
							EditorView.lineWrapping,
							blockquote(),
							codeblock(),
							headings(),
							hideMarks(),
							htmlBlock,
							image(),
							links(),
							lists(),
							headingSlugField,
							imagePreview,
							// markdown({
							// 	base: markdownLanguage,
							// 	extensions: [frontmatter],
							// 	codeLanguages: languages
							// }),
							...EditorTheme,
							yCollab(yText, null)
						]
						console.log('>>>>>>', 'CREATING EDITOR VIEW', extensions)
						editorViewRef.current = new EditorView({
							parent: containerRef.current,
							doc: yText.toString(),
							extensions
						})

						if (typeof onLoaded === 'function') {
							onLoaded()
						}
					}
				}
			}

			void load()

			return () => {
				if (editorViewRef.current) {
					editorViewRef.current.destroy()
					editorViewRef.current = undefined
				}
			}
		}, [
			containerRef,
			editorViewRef,
			fileSystemFile.name,
			fileSystemFile.parentHandle,
			onLoaded,
			syncDoc
		])

		return <div ref={containerRef} />
	}
)

Editor.displayName = 'Editor'

export { Editor }
