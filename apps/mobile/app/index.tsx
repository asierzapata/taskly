import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { TimelineList } from 'react-native-calendars'
import groupBy from 'lodash/groupBy'

export default function Page() {
	// ref
	const bottomSheetRef = React.useRef<BottomSheet>(null)

	// variables
	const snapPoints = React.useMemo(() => ['10%', '25%', '50%', '100%'], [])

	// callbacks
	const handleSheetChanges = React.useCallback((index: number) => {
		console.log('handleSheetChanges', index)
	}, [])

	const eventsByDate = groupBy(timelineEvents, e =>
		CalendarUtils.getCalendarDateString(e.start)
	) as {
		[key: string]: TimelineEventProps[]
	}

	// renders
	return (
		<View style={styles.container}>
			<TimelineList
				events={eventsByDate}
				timelineProps={{
					format24h: true,
					// onBackgroundLongPress: this.createNewEvent,
					// onBackgroundLongPressOut: this.approveNewEvent,
					// scrollToFirst: true,
					// start: 0,
					// end: 24,
					unavailableHours: [
						{ start: 0, end: 6 },
						{ start: 22, end: 24 }
					],
					overlapEventsSpacing: 8,
					rightEdgeSpacing: 24
				}}
				showNowIndicator
				// scrollToNow
				scrollToFirst
				initialTime={{ hour: 9, minutes: 0 }}
			/>
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={styles.BottomSheet}
			>
				<View style={styles.contentContainer}>
					<Text>Awesome 🎉</Text>
				</View>
			</BottomSheet>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 24
	},
	BottomSheet: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,

		elevation: 7
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	}
})

// MOCK DATA
import { TimelineEventProps, CalendarUtils } from 'react-native-calendars'

const EVENT_COLOR = '#e6add8'
const today = new Date()
export const getDate = (offset = 0) =>
	CalendarUtils.getCalendarDateString(
		new Date().setDate(today.getDate() + offset)
	)

export const timelineEvents: TimelineEventProps[] = [
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
		color: EVENT_COLOR
	},
	{
		start: `${getDate()} 01:30:00`,
		end: `${getDate()} 02:30:00`,
		title: 'Meeting B',
		summary: 'Summary for meeting B',
		color: EVENT_COLOR
	},
	{
		start: `${getDate()} 01:45:00`,
		end: `${getDate()} 02:45:00`,
		title: 'Meeting C',
		summary: 'Summary for meeting C',
		color: EVENT_COLOR
	},
	{
		start: `${getDate()} 02:40:00`,
		end: `${getDate()} 03:10:00`,
		title: 'Meeting D',
		summary: 'Summary for meeting D',
		color: EVENT_COLOR
	},
	{
		start: `${getDate()} 02:50:00`,
		end: `${getDate()} 03:20:00`,
		title: 'Meeting E',
		summary: 'Summary for meeting E',
		color: EVENT_COLOR
	},
	{
		start: `${getDate()} 04:30:00`,
		end: `${getDate()} 05:30:00`,
		title: 'Meeting F',
		summary: 'Summary for meeting F',
		color: EVENT_COLOR
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
		color: EVENT_COLOR
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
