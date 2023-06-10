import React from 'react'
import ReactDom from 'react-dom/client'

import { AppRouter } from './router'

/* ====================================================== */
/*                         Styles                        */
/* ====================================================== */

import './styles/globals.css'

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

export const renderReactApp = (el: string) => {
	ReactDom.createRoot(document.querySelector(el) ).render(
		<React.StrictMode>
			<AppRouter />
		</React.StrictMode>
	)
}
