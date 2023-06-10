import React from 'react'
import {
	createHashRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

import { MainScreen } from '@renderer/screens/main_screen'

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
