import { type AppType } from 'next/app'

import '@/styles/globals.css'
import Head from 'next/head'
import { PageLoading } from '@/components/page_loading'
// import { useAnalytics } from '@/lib/analytics'

import { ThemeProvider } from 'next-themes'

const App: AppType = ({ Component, pageProps }) => {
	// useAnalytics()

	return (
		<ThemeProvider attribute="class">
			<Head>
				<title>Taskly</title>
				<link rel="icon" type="image/x-icon" href="/assets/icon.ico"></link>
			</Head>
			<PageLoading />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default App
