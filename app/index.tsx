import { useAuth } from '@/services/authentication'
import { Text, View } from 'react-native'

export default function Index() {
	const { signOut } = useAuth()
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text onPress={() => signOut()}>Sign Out</Text>
		</View>
	)
}
