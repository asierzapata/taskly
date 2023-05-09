import React from 'react'

import { useRouter, useSegments } from 'expo-router'
import { account } from '../appwrite'

type User = {
	name: string
	email: string
}

type AuthContextValue = {
	signInWithEmail: (credentials: {
		email: string
		password: string
	}) => Promise<void>
	signOut: () => void
	user: User | null
}

const AuthContext = React.createContext<AuthContextValue>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	signInWithEmail: async () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	signOut: () => {},
	user: null
})

// This hook can be used to access the user info.
export function useAuth() {
	return React.useContext(AuthContext)
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
	const segments = useSegments()
	const router = useRouter()

	React.useEffect(() => {
		const inAuthGroup = segments[0] === '(auth)'

		if (
			// If the user is not signed in and the initial segment is not anything in the auth group.
			!user &&
			!inAuthGroup
		) {
			// Redirect to the sign-in page.
			router.replace('/sign-in')
		} else if (user && inAuthGroup) {
			// Redirect away from the sign-in page.
			router.replace('/')
		}
	}, [user, segments])
}

export function AuthenticationProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [user, setUser] = React.useState<User | null>(null)

	useProtectedRoute(user)

	const updateUser = React.useCallback(async () => {
		const response = await account.get()

		setUser({
			name: response.name,
			email: response.email
		})
	}, [])

	const signInWithEmail = React.useCallback(
		async ({ email, password }: { email: string; password: string }) => {
			await account.createEmailSession(email, password)
			await updateUser()
		},
		[updateUser]
	)

	const signOut = React.useCallback(() => {
		console.log('>>>>>>', 'signOut')
		setUser(null)
	}, [])

	const contextValue = React.useMemo(() => {
		return {
			signInWithEmail,
			signOut,
			user
		}
	}, [signInWithEmail, signOut, user])

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	)
}
