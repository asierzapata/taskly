import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import uuid from 'react-native-uuid'

import type { RootState } from '@/store'
import type { PayloadAction } from '@reduxjs/toolkit'

type CalendarManagementState = Record<string, never>

const initialState: CalendarManagementState = {}

export const calendarManagement = createSlice({
	name: 'calendarManagement',
	initialState,
	reducers: {}
})

// Actions
// -------

export const {} = calendarManagement.actions

// Reducer
// -------

export const calendarManagementReducer = calendarManagement.reducer

// Selectors
// ---------
