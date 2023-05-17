import { Slot } from 'expo-router'
// import { AuthenticationProvider } from '../services/authentication'
import { StatusBar } from 'expo-status-bar'

import { ThemeProvider } from '@react-navigation/native'
import { StyleSheet, useColorScheme } from 'react-native'
// import { darkNavigationTheme, lightNavigationTheme } from '@/ui/colors'

// import { Box } from '@/ui/box'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Redux
// import { store } from '@/modules/store'
// import { Provider } from 'react-redux'

export default function Root() {
	const scheme = useColorScheme()

	return (
		// <Provider store={store}>
		// <ThemeProvider
		// 	value={scheme === 'dark' ? darkNavigationTheme : lightNavigationTheme}
		// >
		// <AuthenticationProvider>
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<Slot />
			</SafeAreaView>
			<StatusBar style="auto" />
		</SafeAreaProvider>
		// </AuthenticationProvider>
		// 	</ThemeProvider>
		// </Provider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
})
