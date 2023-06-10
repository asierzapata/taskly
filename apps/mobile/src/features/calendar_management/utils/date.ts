import { CalendarUtils } from 'react-native-calendars'

export const getDate = (offset = 0): string => {
	const today = new Date()
	return CalendarUtils.getCalendarDateString(
		new Date().setDate(today.getDate() + offset)
	) as string
}
