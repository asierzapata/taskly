import {
	defaultKeymap,
	historyKeymap,
	indentLess,
	indentMore
} from '@codemirror/commands'
import { markdownKeymap } from '@codemirror/lang-markdown'
import { foldKeymap } from '@codemirror/language'
import { searchKeymap } from '@codemirror/search'
import {
	EditorSelection,
	type EditorState,
	type Extension,
	Text,
	Transaction
} from '@codemirror/state'
import { type KeyBinding, keymap } from '@codemirror/view'
// import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'

const addMarkdownFormatCharacters =
	(characters: string) =>
	({
		state,
		dispatch
	}: {
		state: EditorState
		dispatch: (tr: Transaction) => void
	}) => {
		const characterToChange = characters
		const changes = state.changeByRange(range => {
			const isCharacterBefore =
				state.sliceDoc(range.from - 2, range.from) === characterToChange
			const isCharacterAfter =
				state.sliceDoc(range.to, range.to + 2) === characterToChange
			const changes = []

			changes.push(
				isCharacterBefore
					? {
							from: range.from - 2,
							to: range.from,
							insert: Text.of([''])
					  }
					: {
							from: range.from,
							insert: Text.of([characterToChange])
					  }
			)

			changes.push(
				isCharacterAfter
					? {
							from: range.to,
							to: range.to + 2,
							insert: Text.of([''])
					  }
					: {
							from: range.to,
							insert: Text.of([characterToChange])
					  }
			)

			const numberOfCharacters = characterToChange.length
			const extendBefore = isCharacterBefore
				? -numberOfCharacters
				: numberOfCharacters
			const extendAfter = isCharacterAfter
				? -numberOfCharacters
				: numberOfCharacters

			return {
				changes,
				range: EditorSelection.range(
					range.from + extendBefore,
					range.to + extendAfter
				)
			}
		})

		dispatch(
			state.update(changes, {
				scrollIntoView: true,
				annotations: Transaction.userEvent.of('input')
			})
		)

		return true
	}

const keyMaps: KeyBinding[] = [
	{
		key: 'Mod-b',
		run: addMarkdownFormatCharacters('**')
	},
	{
		key: 'Mod-i',
		run: addMarkdownFormatCharacters('_')
	}
]

export const keymaps = (): Extension => {
	return keymap.of([
		...keyMaps,
		...defaultKeymap,
		...foldKeymap,
		...historyKeymap,
		...searchKeymap,
		...markdownKeymap
	])
}
