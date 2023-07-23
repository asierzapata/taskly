import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, Icons, Input, classnames } from '@taskly/web-ui'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import { type Note } from '../types'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { searchNotesInSafe } from '../note_management_slice'
import { type Position } from '@orama/plugin-match-highlight'

type NoteFinderProps = {
	onBack: () => void
	onNoteSelected: (note: Note) => void
	onNotePositionSelected: ({
		note,
		position
	}: {
		note: Note
		position: Position
	}) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteFinder = ({
	onBack,
	onNoteSelected,
	onNotePositionSelected
}: NoteFinderProps) => {
	const [query, setQuery] = React.useState('')
	const searchResults = useAppSelector(
		state => state.noteManagement.noteSearch.searchResults
	)
	const dispatch = useAppDispatch()

	const handleSearch = _.throttle((query: string) => {
		console.log(query)
		void dispatch(
			searchNotesInSafe({
				searchQuery: query
			})
		)
	}, 500)

	const handleQueryChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value
		setQuery(query)
		handleSearch(query)
	}

	return (
		<div className="">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" onClick={onBack}>
					<Icons.chevronLeft className="h-4 w-4" />
				</Button>
				<Input
					className="flex-1"
					placeholder="Search"
					autoFocus
					value={query}
					onChange={handleQueryChanged}
				/>
			</div>
			{searchResults.count > 0 ? (
				<div className="mt-3 text-sm">
					{searchResults.count} search{' '}
					{searchResults.count === 1 ? 'result' : 'results'}
				</div>
			) : null}
			<div className="mt-4">
				{searchResults.notes.map(note => (
					<NoteSearchResult
						key={note.searchId}
						name={note.name as string}
						path={note.path as string}
						content={note.content as string}
						highlights={note.highlights}
						onNoteSelected={onNoteSelected}
						onNotePositionSelected={onNotePositionSelected}
					/>
				))}
			</div>
		</div>
	)
}

const NoteSearchResult = ({
	name,
	path,
	content,
	highlights,
	onNoteSelected,
	onNotePositionSelected
}: {
	name: string
	path: string
	content: string
	highlights: {
		name: Record<string, Position[]>
		content: Record<string, Position[]>
	}
	onNoteSelected: (note: Note) => void
	onNotePositionSelected: ({
		note,
		position
	}: {
		note: Note
		position: Position
	}) => void
}) => {
	const [isExpanded, setIsExpanded] = React.useState(false)

	const note = useAppSelector(state =>
		Object.values(state.noteManagement.notes).find(
			note => note.path === path && note.name === name
		)
	)

	const handleExpandResult = () => {
		setIsExpanded(_isExpanded => !_isExpanded)
	}

	const handleSelectedNote = () => {
		if (note) {
			onNoteSelected?.(note)
		}
	}

	const handleNotePositionSelected = (position: Position) => {
		if (note) {
			onNotePositionSelected?.({ note, position })
		}
	}

	const numberOfHighlights =
		_.flatten(Object.values(highlights.content)).length +
		_.flatten(Object.values(highlights.name)).length

	const noteName = React.useMemo(() => {
		if (!note) {
			return [{ content: '', highlight: false }]
		}
		const displayName = note.displayName
		if (Object.values(highlights.name).length === 0) {
			return [{ content: displayName, highlight: false }]
		}
		const rangesToHighlight = _.flatten(Object.values(highlights.name)).sort(
			(a, b) => a.start - b.start
		)
		const noteNameArray = []

		let lastEnd = 0
		_.forEach(rangesToHighlight, range => {
			noteNameArray.push({
				content: displayName.slice(lastEnd, range.start),
				highlight: false
			})
			noteNameArray.push({
				content: displayName.slice(range.start, range.start + range.length),
				highlight: true
			})
			lastEnd = range.start + range.length
		})
		noteNameArray.push({
			content: displayName.slice(lastEnd),
			highlight: false
		})
		return noteNameArray
	}, [note, highlights.name])

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-start gap-2">
				<span className="bg-accent w-5 rounded p-0.5 text-center text-xs italic">
					{numberOfHighlights}
				</span>
				<Button
					variant="ghost"
					className="block flex-1 truncate text-start"
					onClick={handleSelectedNote}
				>
					{_.map(noteName, (name, index) => {
						return (
							<span
								key={index}
								className={classnames(
									'font-semibold',
									name.highlight && 'text-secondary'
								)}
							>
								{name.content}
							</span>
						)
					})}
				</Button>
				{!_.isEmpty(highlights.content) ? (
					<Button
						size="icon"
						variant="ghost"
						className="flex-shrink-0"
						onClick={handleExpandResult}
					>
						{isExpanded ? (
							<Icons.chevronUp className="h-4 w-4" />
						) : (
							<Icons.chevronDown className="h-4 w-4" />
						)}
					</Button>
				) : null}
			</div>
			{isExpanded ? (
				<div className="flex flex-col">
					{_.map(highlights.content, highlights => {
						return _.map(highlights, (highlight, index) => {
							return (
								<NoteHighlight
									key={index}
									content={content}
									highlight={highlight}
									onNotePositionSelected={handleNotePositionSelected}
								/>
							)
						})
					})}
				</div>
			) : null}
		</div>
	)
}

const NoteHighlight = ({
	content,
	highlight,
	onNotePositionSelected
}: {
	content: string
	highlight: Position
	onNotePositionSelected: (position: Position) => void
}) => {
	const textBefore = content.slice(highlight.start - 20, highlight.start)
	const textAfter = content.slice(
		highlight.start + highlight.length,
		highlight.start + highlight.length + 20
	)
	const text = content.slice(
		highlight.start,
		highlight.start + highlight.length
	)

	const handleSelectedNotePosition = () => {
		onNotePositionSelected(highlight)
	}

	return (
		<Button
			variant="ghost"
			className="block truncate text-start text-sm"
			onClick={handleSelectedNotePosition}
		>
			<span className="text-muted-foreground">{textBefore}</span>
			<span className="text-secondary">{text}</span>
			<span className="text-muted-foreground">{textAfter}</span>
		</Button>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteFinder }
