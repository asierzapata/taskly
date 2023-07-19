import {
	HighlightStyle,
	type TagStyle,
	syntaxHighlighting
} from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { EditorView } from 'codemirror'
import _ from 'lodash'

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

export const getRandomUserColor = () => {
	const color = _.sample(userColors)
	if (!color) {
		return {
			color: '#30bced',
			light: '#30bced33'
		}
	}
	return color
}

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

type StyleSpec = {
	[propOrSelector: string]: string | number | StyleSpec | null
}

const createTheme = ({
	theme,
	settings = {},
	styles = []
}: CreateThemeOptions) => {
	const themeOptions: {
		[selector: string]: StyleSpec
	} = {
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
		themeOptions['.cm-gutters'] = {
			...themeOptions['.cm-gutters'],
			backgroundColor: settings.gutterBackground
		}
	}
	if (settings.gutterForeground) {
		themeOptions['.cm-gutters'] = {
			...themeOptions['.cm-gutters'],
			color: settings.gutterForeground
		}
	}
	if (settings.gutterBorder) {
		themeOptions['.cm-gutters'] = {
			...themeOptions['.cm-gutters'],
			borderRightColor: settings.gutterBorder
		}
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
	const activeLineGutterStyle: StyleSpec = {}
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

export const EditorTheme = createTheme({
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
