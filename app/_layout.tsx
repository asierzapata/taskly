import { Slot } from 'expo-router'
import { AuthenticationProvider } from '../services/authentication'
import { StatusBar } from 'expo-status-bar'
import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
	useTheme
} from '@react-navigation/native'
import { View, useColorScheme } from 'react-native'

export default function Root() {
	const scheme = useColorScheme()
	const colors = useTheme().colors

	console.log('>>>>>>', colors)
	return (
		<ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
			<AuthenticationProvider>
				<Slot />
				<StatusBar style="auto" />
			</AuthenticationProvider>
		</ThemeProvider>
	)
}
