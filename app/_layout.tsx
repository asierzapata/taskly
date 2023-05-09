import { Slot } from 'expo-router'
import { AuthenticationProvider } from '../services/authentication'
import { StatusBar } from 'expo-status-bar'
import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme
} from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { Box } from '@/ui/box'

// Redux
import { store } from '@/modules/store'
import { Provider } from 'react-redux'

export default function Root() {
	const scheme = useColorScheme()

	return (
		<Provider store={store}>
			<ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
				<AuthenticationProvider>
					<Box backgroundColor="background" flex={1}>
						<Slot />
					</Box>
					<StatusBar style="auto" />
				</AuthenticationProvider>
			</ThemeProvider>
		</Provider>
	)
}
