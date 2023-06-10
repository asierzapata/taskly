/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

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
import React from 'react'

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

export const MainScreen = () => {
	const [email, setEmail] = React.useState('')
	const [loading, setLoading] = React.useState(false)

	const handleLogin = async () => {
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
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Create an account</CardTitle>
					<CardDescription>
						Enter your email below to create your account
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
					{/* <div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" />
					</div> */}
				</CardContent>
				<CardFooter>
					<Button className="w-full" disabled={loading} onClick={handleLogin}>
						Create account
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
