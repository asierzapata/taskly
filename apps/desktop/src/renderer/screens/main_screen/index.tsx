/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Icons,
	classnames
} from '@taskly/web-ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { NoteEditor } from '@renderer/note_editor'
import SplitPane from 'react-split-pane'

import './titlebar.css'
import './split-pane.css'

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

export const MainScreen = () => {
	return (
		<>
			<div className="min-h-screen-without-frame max-h-screen-without-frame relative flex w-full">
				{/* this lib is incompatible with react18. To fix     // children: React.ReactNode; needs to be added to SplitPaneProps.
				// @ts-ignore TS2322 */}
				<SplitPane split="vertical" defaultSize={250} maxSize={300}>
					<SideBar />
					{/* this lib is incompatible with react18. To fix     // children: React.ReactNode; needs to be added to SplitPaneProps.
					 // @ts-ignore TS2322 */}
					<SplitPane split="vertical" primary="second" defaultSize="25%">
						{/* <Editor /> */}
						<Calendar />
					</SplitPane>
				</SplitPane>
			</div>
		</>
	)
}

function SideBar() {
	return (
		<div className="relative flex h-full flex-col items-center justify-between rounded-lg shadow-md">
			<div className="w-full p-3">
				<Button
					variant="ghost"
					className={classnames(
						'flex w-full items-center justify-start gap-3 px-0'
					)}
					// onClick={onToggle}
				>
					<Icons.chevronLeft size={20} />
					<span className="flex items-center gap-3 ">
						<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
							Taskly
						</span>
					</span>
				</Button>
			</div>
			<div className="w-full flex-1 overflow-y-auto p-3">
				<NotesTree />
			</div>
		</div>
	)
}

function Editor() {
	const value = localStorage.getItem('myValue') || ''

	return (
		<div className="mx-auto w-full max-w-[900px] overflow-y-auto p-6">
			<NoteEditor noteId="user-document" />
		</div>
	)
}

import {
	Calendar as BigCalendar,
	dateFnsLocalizer,
	Event,
	Navigate,
	DateLocalizer
} from 'react-big-calendar'
// @ts-ignore
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

import withDragAndDrop, {
	withDragAndDropProps
} from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'
import add from 'date-fns/add'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import { File, Folder } from '@modules/note_file_system/types'
import { NotesTree } from '@renderer/features/note_management/notes_tree'

const locales = {
	'en-US': enUS
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales
})
//@ts-ignore
const DnDCalendar = withDragAndDrop(BigCalendar)

function MyWeek({
	date,
	localizer,
	max = localizer.endOf(new Date(), 'day'),
	min = localizer.startOf(new Date(), 'day'),
	scrollToTime = localizer.startOf(new Date(), 'day'),
	...props
}: {
	date: Date
	localizer: DateLocalizer
	max: Date
	min: Date
	scrollToTime: Date
}) {
	const currRange = React.useMemo(
		() => MyWeek.range(date, { localizer }),
		[date, localizer]
	)

	return (
		<TimeGrid
			eventOffset={15}
			localizer={localizer}
			max={max}
			min={min}
			range={currRange}
			scrollToTime={scrollToTime}
			{...props}
		/>
	)
}

MyWeek.range = (
	date: Date,
	{
		localizer
	}: {
		localizer: DateLocalizer
	}
) => {
	const start = date
	const end = add(start, {
		days: 2
	})

	let current = start
	const range = []

	while (localizer.lte(current, end, 'day')) {
		range.push(current)
		current = localizer.add(current, 1, 'day')
	}

	return range
}

MyWeek.navigate = (
	date: Date,
	action: (typeof Navigate)[keyof typeof Navigate],
	{
		localizer
	}: {
		localizer: DateLocalizer
	}
) => {
	switch (action) {
		case Navigate.PREVIOUS:
			return localizer.add(date, -3, 'day')

		case Navigate.NEXT:
			return localizer.add(date, 3, 'day')

		default:
			return date
	}
}

MyWeek.title = (date: Date) => {
	return `${date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long'
	})}`
}

function Calendar() {
	const [events, setEvents] = React.useState<Event[]>([
		{
			title: 'Learn cool stuff',
			start,
			end
		}
	])

	const { defaultDate, views } = React.useMemo(
		() => ({
			defaultDate: new Date(),
			views: {
				week: MyWeek
			}
		}),
		[]
	)

	const onEventResize: withDragAndDropProps['onEventResize'] = data => {
		const { start, end } = data

		setEvents(currentEvents => {
			const firstEvent = {
				start: new Date(start),
				end: new Date(end)
			}
			return [...currentEvents, firstEvent]
		})
	}

	const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
		console.log(data)
	}

	return (
		<DnDCalendar
			defaultDate={defaultDate}
			defaultView="week"
			events={events}
			localizer={localizer}
			onEventDrop={onEventDrop}
			onEventResize={onEventResize}
			views={views}
		/>
	)
}
