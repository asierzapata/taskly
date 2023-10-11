import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from 'react-router-dom'

import { HomeLayout } from '@/screens/home_layout'
import { HomeWelcome } from '@/screens/home_welcome'
import { FileSystemWrapper } from '@/screens/file_system_wrapper'
import { Note } from '@/screens/note'

const appRouter = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<FileSystemWrapper />}>
				<Route path="/" element={<HomeLayout />}>
					<Route path="home" element={<HomeWelcome />} />
					<Route path="note/:noteId" element={<Note />} />
				</Route>
			</Route>
		</>
	)
)

export function AppRouter() {
	return <RouterProvider router={appRouter} />
}
