import React, { useRef, useEffect, useImperativeHandle } from 'react'
import {
	EditorView,
	highlightSpecialChars,
	drawSelection,
	keymap,
	scrollPastEnd,
	dropCursor
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'

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
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'
import {
	markdown,
	markdownKeymap,
	markdownLanguage
} from '@codemirror/lang-markdown'
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

import { NoteEditorTheme, getRandomUserColor } from './theme'

// Yjs
// ---

import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

// Types
// -----

type NoteEditorProps = {
	editorViewRef?: React.MutableRefObject<EditorView>
	initialDocument?: string
	onChange?: (value: string) => void
}

// Component
// ---------

const NoteEditor = React.forwardRef(
	(
		{
			editorViewRef: editorViewRefProp,
			initialDocument,
			onChange
		}: NoteEditorProps,
		ref
	) => {
		const editorViewRefInternal = useRef<EditorView>()
		const containerRef = useRef<HTMLDivElement | null>(null)

		const editorViewRef = editorViewRefProp || editorViewRefInternal

		useImperativeHandle(ref, () => ({
			getValue: () => editorViewRef.current?.state.doc.toString()
		}))

		useEffect(() => {
			if (containerRef.current) {
				if (!editorViewRef.current) {
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
						keymap.of([...vscodeKeymap, ...markdownKeymap]),
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
						markdown({
							base: markdownLanguage,
							extensions: [frontmatter],
							codeLanguages: languages
						}),
						...NoteEditorTheme
					]
					editorViewRef.current = new EditorView({
						state: EditorState.create({
							doc: initialDocument || '',
							extensions
						}),
						parent: containerRef.current
					})
				}
			}

			return () => {
				if (editorViewRef.current) {
					editorViewRef.current.destroy()
					editorViewRef.current = undefined
				}
			}
		}, [containerRef, editorViewRef])

		return <div ref={containerRef} />
	}
)

NoteEditor.displayName = 'NoteEditor'

export { NoteEditor }
