import React from 'react'
import ReactDom from 'react-dom/client'

import { AppRouter } from './router'
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
			<AppRouter />
		</React.StrictMode>
	)
}
