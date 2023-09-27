import {
	Decoration,
	type DecorationSet,
	EditorView,
	ViewPlugin,
	type ViewUpdate,
	WidgetType
} from '@codemirror/view'
import { type Range } from '@codemirror/state'
import {
	iterateTreeInVisibleRanges,
	editorLines,
	isCursorInRange,
	checkRangeSubset
} from '../util'
import { blockquote as classes } from '../classes'

const quoteMarkRE = /^(\s*>+)/gm

type BlockQuoteWidget = 'first' | 'last' | 'middle'

class BlockQuoteBorderWidget extends WidgetType {
	constructor(readonly type: BlockQuoteWidget = 'middle') {
		super()
	}
	toDOM(): HTMLElement {
		const dom = document.createElement('span')
		let className = classes.mark
		className = this.type === 'first' ? classes.firstMark : className
		className = this.type === 'last' ? classes.lastMark : className
		dom.classList.add(className)
		return dom
	}
}

/**
 * Plugin to add style blockquotes.
 */
class BlockQuotePlugin {
	decorations: DecorationSet
	constructor(view: EditorView) {
		this.decorations = this.styleBlockquote(view)
	}
	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged || update.selectionSet) {
			this.decorations = this.styleBlockquote(update.view)
		}
	}
	/**
	 *
	 * @param view - The editor view
	 * @returns The blockquote decorations to add to the editor
	 */
	private styleBlockquote(view: EditorView): DecorationSet {
		const widgets: Range<Decoration>[] = []
		iterateTreeInVisibleRanges(view, {
			enter: ({ name, from, to }) => {
				if (name !== 'Blockquote') return
				const lines = editorLines(view, from, to)

				lines.forEach((line, index) => {
					let className = index === 0 ? classes.firstWidget : classes.widget
					className =
						index === lines.length - 1 ? classes.lastWidget : className
					const lineDec = Decoration.line({
						class: className
					})
					widgets.push(lineDec.range(line.from))
				})

				if (
					lines.every(
						line => !isCursorInRange(view.state, [line.from, line.to])
					)
				) {
					const marks = Array.from(
						view.state.sliceDoc(from, to).matchAll(quoteMarkRE)
					)
						.map(x => (x.index ? from + x.index : from))
						.map((i, markNumber, _marks) => {
							let widgetType: BlockQuoteWidget = 'middle'
							if (markNumber === 0) {
								widgetType = 'first'
							}
							if (markNumber === _marks.length - 1) {
								widgetType = 'last'
							}
							console.log('>>>>>>', {
								i,
								from,
								to,
								markNumber,
								length: _marks.length,
								widgetType
							})
							return Decoration.replace({
								widget: new BlockQuoteBorderWidget(widgetType)
							}).range(i, i + 1)
						})
					lines.forEach((line, i) => {
						if (
							!marks.some(mark =>
								checkRangeSubset([line.from, line.to], [mark.from, mark.to])
							)
						) {
							let widgetType: BlockQuoteWidget = i === 0 ? 'first' : 'middle'
							widgetType = i === lines.length - 1 ? 'last' : 'middle'
							marks.push(
								Decoration.widget({
									widget: new BlockQuoteBorderWidget(widgetType)
								}).range(line.from)
							)
						}
					})

					widgets.push(...marks)
				}
			}
		})
		return Decoration.set(widgets, true)
	}
}

const blockQuotePlugin = ViewPlugin.fromClass(BlockQuotePlugin, {
	decorations: v => v.decorations
})

/**
 * Default styles for blockquotes.
 */
const baseTheme = EditorView.baseTheme({
	['.' + classes.mark]: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '2px',
		height: '100%',
		'border-left': '4px solid var(--secondary)'
	},
	['.' + classes.firstMark]: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '2px',
		height: '100%',
		'border-radius': '3px 0 0 0',
		'border-left': '4px solid var(--secondary)'
	},
	['.' + classes.lastMark]: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '2px',
		height: '100%',
		'border-radius': '0 0 0 3px',
		'border-left': '4px solid var(--secondary)'
	},
	['.' + classes.widget]: {
		color: 'var(--secondary-foreground)',
		backgroundColor: 'var(--secondary-light)',
		padding: '1rem',
		position: 'relative'
	},
	['.' + classes.firstWidget]: {
		color: 'var(--secondary-foreground)',
		'border-radius': '3px 3px 0 0',
		backgroundColor: 'var(--secondary-light)',
		padding: '1rem',
		position: 'relative'
	},
	['.' + classes.lastWidget]: {
		color: 'var(--secondary-foreground)',
		'border-radius': '0 0 3px 3px',
		backgroundColor: 'var(--secondary-light)',
		padding: '1rem',
		position: 'relative'
	}
})

/**
 *  blockquote plugin.
 *
 * This plugin allows to:
 * - Decorate blockquote marks in the editor
 * - Add default styling to blockquote marks
 */
export function blockquote() {
	return [blockQuotePlugin, baseTheme]
}
