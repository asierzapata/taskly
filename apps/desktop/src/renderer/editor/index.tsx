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
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { history } from '@codemirror/commands'

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
		background: 'transparent',
		foreground: '#e1e7ef',
		caret: 'rgba(245, 112, 76, 1)',
		// selection: 'rgba(245, 112, 76, 0.8)',
		// selectionMatch: 'rgba(245, 112, 76, 0.8)',
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
			class: 'text-2xl font-bold text-accent-1'
		},
		{
			tag: t.heading2,
			class: 'text-xl font-bold text-accent-2'
		},
		{
			tag: t.heading3,
			class: 'text-lg font-bold text-accent-3'
		},
		{
			tag: t.heading4,
			class: 'text-base font-bold text-accent-4'
		},
		{
			tag: t.heading5,
			class: 'text-sm font-bold text-accent-5'
		},
		{
			tag: t.heading6,
			class: 'text-xs font-bold text-accent-6'
		},
		{
			tag: t.contentSeparator,
			class: 'text-text'
		},
		// {
		// 	tag: t.list,
		// 	class: 'text-accent-6'
		// },
		{
			tag: t.quote,
			class: 'text-accent-3'
		},
		{
			tag: t.emphasis,
			class: 'italic text-accent-5'
		},
		{
			tag: t.strong,
			class: 'font-bold text-accent-1'
		},
		{
			tag: t.link,
			class: 'text-accent-6 underline'
		},
		{
			tag: t.punctuation,
			class: 'text-accent-6'
		},
		{
			tag: t.url,
			class: 'text-accent-6 underline'
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
		const editorViewRefInternal = useRef()
		const containerRef = useRef()

		const editorViewRef = editorViewRefProp || editorViewRefInternal

		useImperativeHandle(ref, () => ({
			getValue: () => editorViewRef.current.state.doc.toString()
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
						keymap.of(vscodeKeymap),
						EditorView.lineWrapping,
						markdown({ base: markdownLanguage, codeLanguages: languages }),
						updateListener,
						...myTheme
					]
					editorViewRef.current = new EditorView({
						state: EditorState.create({
							doc: initialValue,
							extensions
						}),
						parent: containerRef.current
					})
				}
			}
		}, [containerRef, initialValue, editorViewRef, onChange])

		return <div ref={containerRef} />
	}
)

TextEditor.displayName = 'TextEditor'

export default TextEditor
