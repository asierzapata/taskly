import React from 'react'
import ReactDom from 'react-dom/client'

import { persistor, store } from '@renderer/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppRouter } from './router'

import { NoteManagementListener } from './features/note_management/note_management_listener'

/* ====================================================== */
/*                         Styles                        */
/* ====================================================== */

import '../styles/globals.css'

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

export const renderReactApp = (el: string) => {
	const element = document.querySelector(el)
	if (!element) {
		throw new Error(`Element with selector ${el} not found`)
	}
	ReactDom.createRoot(element).render(
		<React.StrictMode>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<AppRouter />
				</PersistGate>
			</Provider>
		</React.StrictMode>
	)
}
