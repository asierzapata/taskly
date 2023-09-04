import { type Extension, type Range } from '@codemirror/state'
import {
	ViewPlugin,
	type DecorationSet,
	Decoration,
	EditorView,
	type ViewUpdate
} from '@codemirror/view'
import {
	isCursorInRange,
	invisibleDecoration,
	iterateTreeInVisibleRanges,
	editorLines
} from '../util'
import { codeblock as classes } from '../classes'

/**
 *  code block plugin.
 *
 * This plugin allows to:
 * - Add default styling to code blocks
 * - Customize visibility of code block markers and language
 */
export const codeblock = (): Extension => [codeBlockPlugin, baseTheme]

const codeBlockPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet
		constructor(view: EditorView) {
			this.decorations = decorateCodeBlocks(view)
		}
		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged || update.selectionSet)
				this.decorations = decorateCodeBlocks(update.view)
		}
	},
	{ decorations: v => v.decorations }
)

function decorateCodeBlocks(view: EditorView) {
	const widgets: Range<Decoration>[] = []
	iterateTreeInVisibleRanges(view, {
		enter: ({ type, from, to, node }) => {
			if (!['FencedCode', 'CodeBlock'].includes(type.name)) return
			editorLines(view, from, to).forEach((block, i) => {
				const lineDec = Decoration.line({
					class: [
						classes.widget,
						i === 0
							? classes.widgetBegin
							: block.to === to
							? classes.widgetEnd
							: ''
					].join(' ')
				})
				widgets.push(lineDec.range(block.from))
			})
			if (isCursorInRange(view.state, [from, to])) return
			const codeBlock = node.toTree()
			codeBlock.iterate({
				enter: ({ type, from: nodeFrom, to: nodeTo }) => {
					switch (type.name) {
						case 'CodeInfo':
						case 'CodeMark':
							const decRange = invisibleDecoration.range(
								from + nodeFrom,
								from + nodeTo
							)
							widgets.push(decRange)
							break
					}
				}
			})
		}
	})
	return Decoration.set(widgets, true)
}

/**
 * Base theme for code block plugin.
 */
const baseTheme = EditorView.baseTheme({
	['.' + classes.widget]: {
		backgroundColor: 'var(--muted)',
		color: 'var(--muted-foreground)',
		'padding-left': '0.5rem',
		'padding-right': '0.5rem'
	},
	['.' + classes.widgetBegin]: {
		borderRadius: '3px 3px 0 0',
		marginTop: '1rem'
	},
	['.' + classes.widgetEnd]: {
		borderRadius: '0 0 3px 3px',
		marginBottom: '1rem'
	}
})
