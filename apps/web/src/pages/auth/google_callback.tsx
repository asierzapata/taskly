import React from 'react'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { Spinner } from '@taskly/web-ui'

/* Example:
	http://localhost:3001/auth/google_callback?
		code=-----
		&scope=email%20profile%20https://www.googleapis.com/auth/calendar.events%20https://www.googleapis.com/auth/calendar.readonly%20openid%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email
		&authuser=0
*/
const GoogleCallback = () => {
	const router = useRouter()
	const [error, setError] = React.useState<string | null>(null)

	const searchParams = router.asPath.split('?')[1]
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams)
		const code = params.get('code')
		if (!code) {
			setError('No code provided')
			return
		}
		// Open deep link
		window.open(`taskly://auth/google_callback?code=${code}`, '_self')
		window.close()
	}, [searchParams])

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<span>{error}</span>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<span>
				Redirecting to{' '}
				<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
					Taskly
				</span>
			</span>
			<Spinner />
		</div>
	)
}

export default GoogleCallback
