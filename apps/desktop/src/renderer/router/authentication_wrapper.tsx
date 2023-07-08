import React from 'react'
import axios from 'axios'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Outlet } from 'react-router-dom'

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icons,
	Input,
	Label,
	Spinner
} from '@taskly/web-ui'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import { authentication } from '@renderer/api'
import { User } from '@renderer/api/parsers/user'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const AuthenticationWrapper = () => {
	const [loading, setLoading] = React.useState(true)
	const [session, setSession] = React.useState<User | null>(null)

	React.useEffect(() => {
		;(async () => {
			try {
				const user = await authentication.getAuthenticatedUser()

				if (user) {
					setSession(user)
				}
			} catch (error) {
				console.error(error)
			}

			setLoading(false)
		})()
	}, [])

	React.useEffect(() => {
		window.api.authentication.OnSignInWithGoogleCallback(async ({ code }) => {
			const user = await authentication.signInWithGoogle({
				code
			})
			setSession(user)
		})
	}, [])

	if (loading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<span>
					Loading{' '}
					<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
						Taskly
					</span>
				</span>
				<Spinner />
			</div>
		)
	}

	return !session ? <Authentication /> : <Outlet />
}

function Authentication() {
	const [loading, setLoading] = React.useState(false)

	const handleSignInWithGoogle = React.useCallback(async () => {
		setLoading(true)

		await window.api.authentication.SignInWithGoogle()

		setLoading(false)
	}, [])

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Sign in</CardTitle>
					<CardDescription>
						To continue, sign in with your Google account
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Button
						variant="outline"
						onClick={handleSignInWithGoogle}
						isLoading={loading}
					>
						<Icons.google className="mr-2 h-4 w-4" />
						Sign in with Google
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AuthenticationWrapper }
