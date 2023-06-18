import React, { useRef, useEffect, useImperativeHandle } from 'react'
import {
	EditorView,
	highlightSpecialChars,
	drawSelection,
	keymap,
	scrollPastEnd,
	dropCursor,
	gutter
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { tags as t } from '@lezer/highlight'
import {
	indentOnInput,
	HighlightStyle,
	TagStyle,
	syntaxHighlighting,
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

import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

export const userColors = [
	{ color: '#30bced', light: '#30bced33' },
	{ color: '#6eeb83', light: '#6eeb8333' },
	{ color: '#ffbc42', light: '#ffbc4233' },
	{ color: '#ecd444', light: '#ecd44433' },
	{ color: '#ee6352', light: '#ee635233' },
	{ color: '#9ac2c9', light: '#9ac2c933' },
	{ color: '#8acb88', light: '#8acb8833' },
	{ color: '#1be7ff', light: '#1be7ff33' }
]

const userColor = userColors[Math.floor(Math.random() * userColors.length)]

export interface CreateThemeOptions {
	/**
	 * Theme inheritance. Determines which styles CodeMirror will apply by default.
	 */
	theme: Theme
	/**
	 * Settings to customize the look of the editor, like background, gutter, selection and others.
	 */
	settings: Settings
	/** Syntax highlighting styles. */
	styles: TagStyle[]
}

type Theme = 'light' | 'dark'

export interface Settings {
	/** Editor background. */
	background?: string
	/** Default text color. */
	foreground?: string
	/** Caret color. */
	caret?: string
	/** Selection background. */
	selection?: string
	/** Selection match background. */
	selectionMatch?: string
	/** Background of highlighted lines. */
	lineHighlight?: string
	/** Gutter background. */
	gutterBackground?: string
	/** Text color inside gutter. */
	gutterForeground?: string
	/** Text active color inside gutter. */
	gutterActiveForeground?: string
	/** Gutter right border color. */
	gutterBorder?: string
	/** set editor font */
	fontFamily?: string
}

type StyleSpec = Record<string, string | number | null | undefined>

const createTheme = ({
	theme,
	settings = {},
	styles = []
}: CreateThemeOptions) => {
	const themeOptions: Record<string, StyleSpec> = {
		'.cm-gutters': {}
	}
	const baseStyle: StyleSpec = {}
	if (settings.background) {
		baseStyle.backgroundColor = settings.background
	}
	if (settings.foreground) {
		baseStyle.color = settings.foreground
	}
	if (settings.background || settings.foreground) {
		themeOptions['&'] = baseStyle
	}

	if (settings.fontFamily) {
		themeOptions['&.cm-editor .cm-scroller'] = {
			fontFamily: settings.fontFamily
		}
	}
	if (settings.gutterBackground) {
		themeOptions['.cm-gutters'].backgroundColor = settings.gutterBackground
	}
	if (settings.gutterForeground) {
		themeOptions['.cm-gutters'].color = settings.gutterForeground
	}
	if (settings.gutterBorder) {
		themeOptions['.cm-gutters'].borderRightColor = settings.gutterBorder
	}

	if (settings.caret) {
		themeOptions['.cm-content'] = {
			caretColor: settings.caret,
			outline: 'none'
		}
		themeOptions['.cm-cursor, .cm-dropCursor'] = {
			borderLeftColor: settings.caret
		}
	}
	let activeLineGutterStyle: StyleSpec = {}
	if (settings.gutterActiveForeground) {
		activeLineGutterStyle.color = settings.gutterActiveForeground
	}
	if (settings.lineHighlight) {
		themeOptions['.cm-activeLine'] = {
			backgroundColor: settings.lineHighlight
		}
		activeLineGutterStyle.backgroundColor = settings.lineHighlight
	}
	themeOptions['.cm-activeLineGutter'] = activeLineGutterStyle

	if (settings.selection) {
		themeOptions[
			'&.cm-focused .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection'
		] = {
			backgroundColor: settings.selection
		}
	}
	if (settings.selectionMatch) {
		themeOptions['& .cm-selectionMatch'] = {
			backgroundColor: settings.selectionMatch
		}
	}
	const themeExtension = EditorView.theme(themeOptions, {
		dark: theme === 'dark'
	})

	const highlightStyle = HighlightStyle.define(styles)
	const extension = [themeExtension, syntaxHighlighting(highlightStyle)]

	return extension
}

const myTheme = createTheme({
	theme: 'dark',
	settings: {
		fontFamily: 'JetBrainsMono',
		background: 'transparent',
		foreground: '#e1e7ef',
		caret: 'rgba(245, 112, 76, 1)',
		selectionMatch: 'rgba(255, 190, 1, 0.8)',
		gutterBackground: 'transparent',
		gutterForeground: '#808da3',
		gutterBorder: '#808da3',
		gutterActiveForeground: '',
		lineHighlight: 'transparent'
	},
	styles: [
		{ tag: t.comment, color: '#787b80' },
		{ tag: t.definition(t.typeName), color: '#f5704c' },
		{ tag: t.typeName, color: '#f5704c' },
		{ tag: t.tagName, color: '#ffbe01' },
		{ tag: t.variableName, color: '#f5704c' },
		{
			tag: t.heading1,
			class: 'tag-heading-1'
		},
		{
			tag: t.heading2,
			class: 'tag-heading-2'
		},
		{
			tag: t.heading3,
			class: 'tag-heading-3'
		},
		{
			tag: t.heading4,
			class: 'tag-heading-4'
		},
		{
			tag: t.heading5,
			class: 'tag-heading-5'
		},
		{
			tag: t.heading6,
			class: 'tag-heading-6'
		},
		{
			tag: t.contentSeparator,
			class: 'text-text'
		},
		{
			tag: t.list,
			class: 'tag-list'
		},
		{
			tag: t.quote,
			class: 'tag-quote'
		},
		{
			tag: t.emphasis,
			class: 'tag-emphasis'
		},
		{
			tag: t.strong,
			class: 'tag-bold'
		},
		{
			tag: t.link,
			class: 'tag-link'
		},
		{
			tag: t.punctuation,
			class: 'text-accent-6'
		},
		{
			tag: t.url,
			class: 'tag-url'
		},
		{
			tag: t.typeName,
			class: 'text-accent-1'
		},
		{
			tag: t.tagName,
			class: 'text-accent-5'
		},
		{
			tag: t.attributeName,
			class: 'text-accent-1'
		},
		{
			tag: t.attributeValue,
			class: 'text-accent-2'
		},
		{
			tag: t.monospace,
			class: 'tag-monospace'
		}
	]
})

type TextEditorProps = {
	initialValue?: string
	editorViewRef?: React.MutableRefObject<EditorView>
	onChange?: ({ value }: { value: string }) => void
}

const TextEditor = React.forwardRef(
	(
		{
			initialValue = '',
			editorViewRef: editorViewRefProp,
			onChange
		}: TextEditorProps,
		ref
	) => {
		const editorViewRefInternal = useRef<EditorView>()
		const containerRef = useRef<HTMLDivElement | null>(null)

		const editorViewRef = editorViewRefProp || editorViewRefInternal

		useImperativeHandle(ref, () => ({
			getValue: () => editorViewRef.current?.state.doc.toString()
		}))

		useEffect(() => {
			const updateListener = EditorView.updateListener.of(v => {
				if (v.docChanged) {
					if (typeof onChange === 'function') {
						onChange({
							value: v.state.doc.toString()
						})
					}
				}
			})

			if (containerRef.current) {
				if (!editorViewRef.current) {
					const ydoc = new Y.Doc()
					const documentId = 'user-document'
					const wsProvider = new WebsocketProvider(
						'ws://localhost:8080/notes',
						documentId,
						ydoc
					)
					const indexeddbProvider = new IndexeddbPersistence(documentId, ydoc)
					indexeddbProvider.whenSynced.then(() => {
						console.log('loaded data from indexed db')
					})

					const ytext = ydoc.getText('codemirror')

					const undoManager = new Y.UndoManager(ytext)

					wsProvider.awareness.setLocalStateField('user', {
						name: 'Anonymous ' + Math.floor(Math.random() * 100),
						color: userColor?.color ?? '#000000',
						colorLight: userColor?.light ?? '#ffffff'
					})

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
						updateListener,
						...myTheme,
						yCollab(ytext, wsProvider.awareness, { undoManager })
					]
					editorViewRef.current = new EditorView({
						state: EditorState.create({
							doc: ytext.toString(),
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
		}, [containerRef, initialValue, editorViewRef, onChange])

		return <div ref={containerRef} />
	}
)

TextEditor.displayName = 'TextEditor'

export { TextEditor }
