import React from 'react'
// import { MainScreen } from '@renderer/screens/main_screen'
import {
	createHashRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

// For now we don't need authentication
// import { AuthenticationWrapper } from './authentication_wrapper'
import { SafeSelection } from '@renderer/screens/safe_selection'
import { SafeCreation } from '@renderer/screens/safe_creation'
import { SafeLayout } from '@renderer/screens/safe_layout'
import { SafeWelcome } from '@renderer/screens/safe_welcome'
import { Note } from '@renderer/screens/note'

const appRouter = createHashRouter(
	createRoutesFromElements(
		<>
			{/* <Route element={<AuthenticationWrapper />}> */}
			<Route path="/" element={<SafeSelection />} />
			<Route path="/create_safe" element={<SafeCreation />} />
			<Route path="/safe/:safeId" element={<SafeLayout />}>
				<Route path="" element={<SafeWelcome />} />
				<Route path="note/:noteId" element={<Note />} />
			</Route>
			{/* </Route> */}
		</>
	)
)

export function AppRouter() {
	return <RouterProvider router={appRouter} />
}
