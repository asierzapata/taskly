import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { darkNavigationTheme, lightNavigationTheme } from '@/ui/colors'

import { Box } from '@/ui/box'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Redux
import { persistor, store } from '@/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function Root() {
	const scheme = useColorScheme()

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider
					value={scheme === 'dark' ? darkNavigationTheme : lightNavigationTheme}
				>
					<SafeAreaProvider>
						<Box as={SafeAreaView} backgroundColor="background" flex={1}>
							<Slot />
						</Box>
						<StatusBar style="auto" />
					</SafeAreaProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	)
}
