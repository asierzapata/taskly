import { ExpoRoot } from 'expo-router'
import { registerRootComponent } from 'expo'
import { type RequireContext } from 'expo-router/build/types'

// Must be exported or Fast Refresh won't update the context
export function App() {
	const ctx = require.context('./src/app')
	return <ExpoRoot context={ctx as RequireContext} />
}

registerRootComponent(App)
