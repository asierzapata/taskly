import React from 'react'
import { MainScreen } from '@renderer/screens/main_screen'
import {
	createHashRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

const appRouter = createHashRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<MainScreen />} />
		</>
	)
)

export function AppRouter() {
	return <RouterProvider router={appRouter} />
}
