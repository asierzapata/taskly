import { Slot } from 'expo-router'
import { AuthenticationProvider } from '../services/authentication'
import { StatusBar } from 'expo-status-bar'

import { ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { darkNavigationTheme, lightNavigationTheme } from '@/ui/colors'

import { Box } from '@/ui/box'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Redux
import { store } from '@/modules/store'
import { Provider } from 'react-redux'

export default function Root() {
	const scheme = useColorScheme()

	return (
		<Provider store={store}>
			<ThemeProvider
				value={scheme === 'dark' ? darkNavigationTheme : lightNavigationTheme}
			>
				<AuthenticationProvider>
					<SafeAreaProvider>
						<Box as={SafeAreaView} backgroundColor="background" flex={1}>
							<Slot />
						</Box>
						<StatusBar style="auto" />
					</SafeAreaProvider>
				</AuthenticationProvider>
			</ThemeProvider>
		</Provider>
	)
}
