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
	Label
} from '@taskly/web-ui'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Session } from '@supabase/supabase-js'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const AuthenticationWrapper = () => {
	const [session, setSession] = React.useState<Session | null>(null)

	React.useEffect(() => {
		window.api.authentication.OnSignInWithGoogleCallback(async ({ code }) => {
			console.log('>>>>>> code', code)
			const response = await axios.post(
				'http://localhost:8080/api/v1/authentication/google',
				{
					code
				}
			)
			const { data } = response
			console.log('>>>>>>', data.data.user)
			setSession(data.data.user)
		})
	}, [])

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
