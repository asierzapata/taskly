import {
	Decoration,
	type DecorationSet,
	EditorView,
	ViewPlugin,
	type ViewUpdate,
	WidgetType
} from '@codemirror/view'
import { isCursorInRange, iterateTreeInVisibleRanges } from '../util'
import { type ChangeSpec, type Range } from '@codemirror/state'
import { type NodeType, type SyntaxNodeRef } from '@lezer/common'
import { list as classes } from '../classes'

const bulletListMarkerRE = /^[-+*]/

/**
 *  Lists plugin.
 *
 * This plugin allows to:
 * - Customize list mark
 * - Add an interactive checkbox for task lists
 */
export const lists = () => [taskListPlugin, baseTheme]

/**
 * Plugin to add checkboxes in task lists.
 */
class TaskListsPlugin {
	decorations: DecorationSet = Decoration.none
	constructor(view: EditorView) {
		this.decorations = this.addCheckboxes(view)
	}
	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged || update.selectionSet)
			this.decorations = this.addCheckboxes(update.view)
	}
	addCheckboxes(view: EditorView) {
		const widgets: Range<Decoration>[] = []
		iterateTreeInVisibleRanges(view, {
			enter: this.iterateTree(view, widgets)
		})
		return Decoration.set(widgets, true)
	}

	private iterateTree(view: EditorView, widgets: Range<Decoration>[]) {
		return ({ type, from, to, node }: SyntaxNodeRef) => {
			if (type.name !== 'Task') return
			let checked = false
			// Iterate inside the task node to find the checkbox
			node.toTree().iterate({
				enter: ref => iterateInner(ref.type, ref.from, ref.to)
			})
			if (checked)
				widgets.push(
					Decoration.mark({
						tagName: 'span',
						class: 'cm-task-checked'
					}).range(from, to)
				)

			function iterateInner(type: NodeType, nfrom: number, nto: number) {
				if (type.name !== 'TaskMarker') return
				const startOfRange = from + nfrom - 2
				const startOfCheckbox = from + nfrom
				const endOfRange = from + nto
				if (isCursorInRange(view.state, [startOfRange, endOfRange])) return
				const checkbox = view.state.sliceDoc(startOfCheckbox, endOfRange)
				const checkboxContent = checkbox[1] ?? ' '
				// Checkbox is checked if it has a 'x' in between the []
				if ('xX'.includes(checkboxContent)) checked = true
				const dec = Decoration.replace({
					widget: new CheckboxWidget(checked, startOfCheckbox + 1)
				})
				widgets.push(dec.range(startOfRange, endOfRange))
			}
		}
	}
}

const checkedSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>'

/**
 * Widget to render checkbox for a task list item.
 */
class CheckboxWidget extends WidgetType {
	constructor(public checked: boolean, readonly pos: number) {
		super()
	}
	toDOM(view: EditorView): HTMLElement {
		const wrap = document.createElement('span')
		wrap.classList.add(classes.taskCheckboxWrapper)
		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.checked = this.checked
		checkbox.classList.add(classes.taskCheckbox)
		if (this.checked) {
			checkbox.classList.add(classes.taskCheckboxChecked)
			const checkWrapper = document.createElement('span')
			checkWrapper.classList.add(classes.taskCheckboxCheckedWrapper)
			checkWrapper.insertAdjacentHTML('afterbegin', checkedSVG)
			wrap.appendChild(checkWrapper)
		}
		checkbox.addEventListener('click', ({ target }) => {
			const change: ChangeSpec = {
				from: this.pos,
				to: this.pos + 1,
				insert: this.checked ? ' ' : 'x'
			}
			view.dispatch({ changes: change })
			this.checked = !this.checked
			;(target as HTMLInputElement).checked = this.checked
		})
		wrap.appendChild(checkbox)
		return wrap
	}
}

const taskListPlugin = ViewPlugin.fromClass(TaskListsPlugin, {
	decorations: v => v.decorations
})

/**
 * Base theme for the lists plugin.
 */
const baseTheme = EditorView.baseTheme({
	// ['.' + classes.bullet]: {
	// 	position: 'relative',
	// 	visibility: 'hidden'
	// },
	['.' + classes.taskCheckboxWrapper]: {
		position: 'relative',
		transition: '0.2s all linear'
	},
	['.' + classes.taskCheckbox]: {
		width: '1rem',
		height: '1rem',
		borderRadius: '0.2rem',
		borderStyle: 'solid',
		borderWidth: '1px',
		borderColor: 'hsl(var(--primary))',
		'-webkit-appearance': 'none',
		'-moz-appearance': 'none',
		appearance: 'none',
		transition: '0.2s all linear'
	},
	['.' + classes.taskCheckboxChecked]: {
		backgroundColor: 'hsl(var(--primary-light))'
	},
	['.' + classes.taskCheckboxCheckedWrapper]: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '14px',
		height: '14px',
		position: 'absolute',
		top: '2px',
		left: '1px',
		lineHeight: 'none',
		pointerEvents: 'none',
		backgroundColor: 'transparent',
		color: 'hsl(var(--primary-foreground))',
		transition: '0.2s all linear'
	},
	['.' + classes.taskChecked]: {
		textDecoration: 'line-through !important'
	}
	// ['.' + classes.bullet + ':after']: {
	// 	visibility: 'visible',
	// 	position: 'absolute',
	// 	top: 0,
	// 	left: 0,
	// 	content: "'\\2022'" /* U+2022 BULLET */
	// }
})
