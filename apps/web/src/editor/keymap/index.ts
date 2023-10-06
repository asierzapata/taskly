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

const addMarkdownFormatCharacters =
	({
		startCharacter,
		endCharacter
	}: {
		startCharacter: string
		endCharacter: string
	}) =>
	({
		state,
		dispatch
	}: {
		state: EditorState
		dispatch: (tr: Transaction) => void
	}) => {
		const changes = state.changeByRange(range => {
			const numberOfCharactersBefore = startCharacter.length
			const numberOfCharactersAfter = endCharacter.length

			const isCharacterBefore =
				state.sliceDoc(range.from - numberOfCharactersBefore, range.from) ===
				startCharacter
			const isCharacterAfter =
				state.sliceDoc(range.to, range.to + numberOfCharactersAfter) ===
				endCharacter
			const changes = []

			changes.push(
				isCharacterBefore
					? {
							from: range.from - numberOfCharactersBefore,
							to: range.from,
							insert: Text.of([''])
					  }
					: {
							from: range.from,
							insert: Text.of([startCharacter])
					  }
			)

			changes.push(
				isCharacterAfter
					? {
							from: range.to,
							to: range.to + numberOfCharactersAfter,
							insert: Text.of([''])
					  }
					: {
							from: range.to,
							insert: Text.of([endCharacter])
					  }
			)

			const extendBefore = isCharacterBefore
				? -numberOfCharactersBefore
				: numberOfCharactersBefore
			const extendAfter = isCharacterAfter
				? -numberOfCharactersAfter
				: numberOfCharactersAfter

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
		run: addMarkdownFormatCharacters({
			startCharacter: '**',
			endCharacter: '**'
		})
	},
	{
		key: 'Mod-i',
		run: addMarkdownFormatCharacters({
			startCharacter: '_',
			endCharacter: '_'
		})
	},
	{
		key: 'Mod-k',
		run: addMarkdownFormatCharacters({
			startCharacter: '[](',
			endCharacter: ')'
		})
	},
	{
		key: 'Mod-Alt-0',
		run: addMarkdownFormatCharacters({
			startCharacter: '# ',
			endCharacter: ''
		})
	},
	{
		key: 'Mod-Alt-1',
		run: addMarkdownFormatCharacters({
			startCharacter: '## ',
			endCharacter: ''
		})
	},
	{
		key: 'Mod-Alt-2',
		run: addMarkdownFormatCharacters({
			startCharacter: '### ',
			endCharacter: ''
		})
	},
	{
		key: 'Mod-Alt-3',
		run: addMarkdownFormatCharacters({
			startCharacter: '#### ',
			endCharacter: ''
		})
	},
	{
		key: 'Mod-Alt-4',
		run: addMarkdownFormatCharacters({
			startCharacter: '##### ',
			endCharacter: ''
		})
	},
	{
		key: 'Mod-Alt-5',
		run: addMarkdownFormatCharacters({
			startCharacter: '###### ',
			endCharacter: ''
		})
	},
	{
		key: 'Tab',
		run: indentMore
	},
	{
		key: 'Shift-Tab',
		run: indentLess
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
