import React from 'react'
import { MainScreen } from '@renderer/screens/main_screen'
import {
	createHashRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

import { AuthenticationWrapper } from './authentication_wrapper'
import { SafeSelection } from '@renderer/screens/safe_selection'
import { SafeCreation } from '@renderer/screens/safe_creation'

const appRouter = createHashRouter(
	createRoutesFromElements(
		<>
			<Route element={<AuthenticationWrapper />}>
				<Route path="/" element={<SafeSelection />} />
				<Route path="/create_safe" element={<SafeCreation />} />
				<Route path="/safe/:id" element={<MainScreen />} />
			</Route>
		</>
	)
)

export function AppRouter() {
	return <RouterProvider router={appRouter} />
}
