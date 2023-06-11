import React from 'react'

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
		window.api.authentication.GetSession().then(({ session }) => {
			console.log('>>>>>> getSession', session)
			setSession(session)
		})

		window.api.authentication.OnAuthenticationStateChanged(({ session }) => {
			console.log('>>>>>> OnAuthStateChange', session)
			setSession(session)
		})

		window.api.authentication.OnAuthenticateMagicLink(response => {
			console.log('>>>>>> OnAuthenticateMagicLink', response)
			if (response.error) {
				alert(response.error)
			}

			if (response.session) {
				setSession(response.session)
			}
		})
	}, [])

	return !session ? <Authentication /> : <Outlet />
}

function Authentication() {
	const [email, setEmail] = React.useState('')
	const [loading, setLoading] = React.useState(false)

	const handleLogin = React.useCallback(async () => {
		setLoading(true)

		const { error } = await window.api.authentication.Authenticate({
			email
		})

		if (error) {
			alert(error)
		} else {
			alert('Check your email for the login link!')
		}

		setLoading(false)
	}, [email])

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Sign in</CardTitle>
					<CardDescription>
						Enter your email below to sign into your account.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid grid-cols-2 gap-6">
						<Button variant="outline">
							<Icons.apple className="mr-2 h-4 w-4" />
							Apple
						</Button>
						<Button variant="outline">
							<Icons.google className="mr-2 h-4 w-4" />
							Google
						</Button>
					</div>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-background text-muted-foreground px-2">
								or continue with
							</span>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						disabled={loading}
						isLoading={loading}
						onClick={handleLogin}
					>
						Create account
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AuthenticationWrapper }
