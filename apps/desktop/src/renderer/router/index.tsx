import React from 'react'
import { MainScreen } from '@renderer/screens/main_screen'
import {
	createHashRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

import { AuthenticationWrapper } from './authentication_wrapper'

const appRouter = createHashRouter(
	createRoutesFromElements(
		<>
			<Route
				element={
					<div className="titlebar">
						<div className="titlebar-text">Taskly</div>
					</div>
				}
			/>
			<Route element={<AuthenticationWrapper />}>
				<Route path="/" element={<MainScreen />} />
			</Route>
		</>
	)
)

export function AppRouter() {
	return <RouterProvider router={appRouter} />
}
