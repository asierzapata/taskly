/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Icons,
	Input,
	Label,
	classnames
} from '@taskly/web-ui'
import React from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { langs } from '@uiw/codemirror-extensions-langs'
import { historyField } from '@codemirror/commands'
import { githubDark } from '@uiw/codemirror-theme-github'

const stateFields = { history: historyField }

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

export const MainScreen = () => {
	return (
		<div className="flex min-h-screen w-full">
			<div className="h-screen max-w-xs">
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
						<nav aria-label="Main Nav" className="flex flex-col space-y-1">
							<Link to={`/`}>
								<Button
									as="a"
									variant="ghost"
									className={classnames(
										'flex w-full items-center gap-3',
										'justify-start'
									)}
									// onClick={isSmallViewport ? onToggle : _.noop}
								>
									<Icons.calendarClock size={20} />
									{/* {isOpen ? ( */}
									<span className="text-sm font-medium"> Today </span>
									{/* ) : null} */}
								</Button>
							</Link>
						</nav>
						<div className="mh-4 mv-6 h-0.5 w-full bg-gradient-to-tl from-amber-400 to-orange-600" />

						<div className="mt-5">
							<Collapsible>
								<span
									className={classnames(
										'flex items-center justify-between rounded px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800',
										Math.random() > 0.5 && 'bg-slate-100 dark:bg-slate-800'
									)}
								>
									<Link to={`/`} className="w-full">
										<span className="ml-4 flex-1 text-sm">
											This is an Area!
										</span>
									</Link>

									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											size="xs"
											className="data-[state=open]:bg-slate-200 data-[state=open]:dark:bg-slate-700 [&[data-state=open]>svg]:rotate-180"
										>
											<Icons.chevronDown
												size={14}
												className="transition-transform duration-200"
											/>
										</Button>
									</CollapsibleTrigger>
								</span>
								<CollapsibleContent>
									<Button
										as="a"
										variant="ghost"
										size="xs"
										className={classnames(
											'flex items-center justify-between rounded px-4 py-4 hover:bg-slate-200 dark:hover:bg-slate-800',
											Math.random() > 0.5 && 'bg-slate-200 dark:bg-slate-800'
										)}
									>
										<span className="ml-4 flex-1 text-xs">
											This is a project!
										</span>
									</Button>
								</CollapsibleContent>
							</Collapsible>
						</div>
					</div>
				</div>
			</div>
			<div className="relative h-screen flex-1 overflow-y-auto">
				<TextEditor />
			</div>
			<div className="relative max-h-screen w-[350px] max-w-[400px] overflow-y-auto p-3">
				<Calendar />
			</div>
		</div>
	)
}

function TextEditor() {
	const serializedState = localStorage.getItem('myEditorState')
	const value = localStorage.getItem('myValue') || ''
	return (
		<CodeMirror
			value={value}
			basicSetup={{
				lineNumbers: false,
				highlightSelectionMatches: true
			}}
			theme={githubDark}
			initialState={
				serializedState
					? {
							json: JSON.parse(serializedState || ''),
							fields: stateFields
					  }
					: undefined
			}
			onChange={(value, viewUpdate) => {
				localStorage.setItem('myValue', value)

				const state = viewUpdate.state.toJSON(stateFields)
				localStorage.setItem('myEditorState', JSON.stringify(state))
			}}
			extensions={[langs.markdown()]}
		/>
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
			// date={date}
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
