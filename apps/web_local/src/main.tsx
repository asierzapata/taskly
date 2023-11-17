import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import './styles/globals.css'

const element = document.querySelector('#root')
if (!element) {
	throw new Error(`Element with selector root not found`)
}

ReactDOM.createRoot(element).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
