import { colors } from '@/ui/colors'
import { groupBy } from 'lodash'
import React from 'react'
import type { DateData, TimelineEventProps } from 'react-native-calendars'
import {
	ExpandableCalendar,
	CalendarProvider,
	CalendarUtils,
	TimelineList
} from 'react-native-calendars'
import { useColorScheme } from 'react-native'
import { getDate } from '../utils/date'
import { pixelUnitVertical } from '@/ui/normalizer'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const timelineEvents: TimelineEventProps[] = [
	{
		start: `${getDate(-1)} 09:20:00`,
		end: `${getDate(-1)} 12:00:00`,
		title: 'Merge Request to React Native Calendars',
		summary: 'Merge Timeline Calendar to React Native Calendars'
	},
	{
		start: `${getDate()} 01:15:00`,
		end: `${getDate()} 02:30:00`,
		title: 'Meeting A',
		summary: 'Summary for meeting A',
		color: '#94a3b8'
	},
	{
		start: `${getDate()} 01:30:00`,
		end: `${getDate()} 02:30:00`,
		title: 'Meeting B',
		summary: 'Summary for meeting B',
		color: '#94a3b8'
	},
	{
		start: `${getDate()} 01:45:00`,
		end: `${getDate()} 02:45:00`,
		title: 'Meeting C',
		summary: 'Summary for meeting C',
		color: '#94a3b8'
	},
	{
		start: `${getDate()} 02:40:00`,
		end: `${getDate()} 03:10:00`,
		title: 'Meeting D',
		summary: 'Summary for meeting D',
		color: '#94a3b8'
	},
	{
		start: `${getDate()} 02:50:00`,
		end: `${getDate()} 03:20:00`,
		title: 'Meeting E',
		summary: 'Summary for meeting E',
		color: '#94a3b8'
	},
	{
		start: `${getDate()} 04:30:00`,
		end: `${getDate()} 05:30:00`,
		title: 'Meeting F',
		summary: 'Summary for meeting F',
		color: '#94a3b8'
	},
	{
		start: `${getDate(1)} 00:30:00`,
		end: `${getDate(1)} 01:30:00`,
		title: 'Visit Grand Mother',
		summary: 'Visit Grand Mother and bring some fruits.',
		color: 'lightblue'
	},
	{
		start: `${getDate(1)} 02:30:00`,
		end: `${getDate(1)} 03:20:00`,
		title: 'Meeting with Prof. Behjet Zuhaira',
		summary: 'Meeting with Prof. Behjet at 130 in her office.',
		color: '#94a3b8'
	},
	{
		start: `${getDate(1)} 04:10:00`,
		end: `${getDate(1)} 04:40:00`,
		title: 'Tea Time with Dr. Hasan',
		summary: 'Tea Time with Dr. Hasan, Talk about Project'
	},
	{
		start: `${getDate(1)} 01:05:00`,
		end: `${getDate(1)} 01:35:00`,
		title: 'Dr. Mariana Joseph',
		summary: '3412 Piedmont Rd NE, GA 3032'
	},
	{
		start: `${getDate(1)} 14:30:00`,
		end: `${getDate(1)} 16:30:00`,
		title: 'Meeting Some Friends in ARMED',
		summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
		color: 'pink'
	},
	{
		start: `${getDate(2)} 01:40:00`,
		end: `${getDate(2)} 02:25:00`,
		title: 'Meet Sir Khurram Iqbal',
		summary: 'Computer Science Dept. Comsats Islamabad',
		color: 'orange'
	},
	{
		start: `${getDate(2)} 04:10:00`,
		end: `${getDate(2)} 04:40:00`,
		title: 'Tea Time with Colleagues',
		summary: 'WeRplay'
	},
	{
		start: `${getDate(2)} 00:45:00`,
		end: `${getDate(2)} 01:45:00`,
		title: 'Lets Play Apex Legends',
		summary: 'with Boys at Work'
	},
	{
		start: `${getDate(2)} 11:30:00`,
		end: `${getDate(2)} 12:30:00`,
		title: 'Dr. Mariana Joseph',
		summary: '3412 Piedmont Rd NE, GA 3032'
	},
	{
		start: `${getDate(4)} 12:10:00`,
		end: `${getDate(4)} 13:45:00`,
		title: 'Merge Request to React Native Calendars',
		summary: 'Merge Timeline Calendar to React Native Calendars'
	}
]

const Timeline = () => {
	const colorScheme = useColorScheme() ?? 'light'

	const [currentDate, setCurrentDate] = React.useState(getDate())

	const onDateChanged = React.useCallback((date: string) => {
		setCurrentDate(date)
	}, [])

	const onMonthChange = React.useCallback((date: DateData) => {
		console.log('>>>>>> on month change', date)
	}, [])

	const createNewEvent = React.useCallback((date: string) => {
		console.log('>>>>>> create new event', date)
	}, [])

	const approveNewEvent = React.useCallback((date: string) => {
		console.log('>>>>>> approve new event', date)
	}, [])

	const marked = React.useMemo(() => {
		return {
			[`${getDate(-1)}`]: { marked: true },
			[`${getDate()}`]: { marked: true },
			[`${getDate(1)}`]: { marked: true },
			[`${getDate(2)}`]: { marked: true },
			[`${getDate(4)}`]: { marked: true }
		}
	}, [])

	const eventsByDate = React.useMemo(() => {
		return groupBy(
			timelineEvents,
			e => CalendarUtils.getCalendarDateString(e.start) as string
		) as {
			[key: string]: TimelineEventProps[]
		}
	}, [])

	const theme = React.useMemo(() => {
		return {
			event: {
				backgroundColor: colors[colorScheme].secondary,
				borderRadius: 6,
				padding: 6,
				borderColor: colors[colorScheme].backgroundLight
			},
			eventTitle: {
				color: colors[colorScheme].text,
				fontSize: pixelUnitVertical(3)
			},
			todayTextColor: colors[colorScheme].secondary,
			calendarBackground: colors[colorScheme].background,
			indicatorColor: colors[colorScheme].secondary,
			dayTextColor: colors[colorScheme].text,
			monthTextColor: colors[colorScheme].text,
			selectedDayBackgroundColor: colors[colorScheme].secondary,
			dotColor: colors[colorScheme].secondary,
			selectedDotColor: colors[colorScheme].secondaryDeep
		}
	}, [colorScheme])

	const timelineProps = React.useMemo(() => {
		return {
			format24h: true,
			onBackgroundLongPress: createNewEvent,
			onBackgroundLongPressOut: approveNewEvent,
			scrollToFirst: true,
			start: 0,
			end: 24,
			overlapEventsSpacing: 8,
			rightEdgeSpacing: 24,
			theme: theme
		}
	}, [approveNewEvent, createNewEvent, theme])

	return (
		<CalendarProvider
			key={colorScheme}
			date={currentDate}
			onDateChanged={onDateChanged}
			onMonthChange={onMonthChange}
			showTodayButton
			disabledOpacity={0.6}
			theme={theme}
		>
			<ExpandableCalendar
				firstDay={1}
				markedDates={marked}
				horizontal
				theme={theme}
			/>
			<TimelineList
				events={eventsByDate}
				timelineProps={timelineProps}
				showNowIndicator
				scrollToNow
			/>
		</CalendarProvider>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Timeline }
