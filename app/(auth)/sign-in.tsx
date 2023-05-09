import React from 'react'
import { useAuth } from '@/services/authentication'
import { Text, View, Button, Alert, ActivityIndicator } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from '@react-navigation/native'
import { TextInput } from '@/ui/form/text_input'
import { Box } from '@/ui/box'

type FormData = {
	email: string
	password: string
}

export default function SignIn() {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const { colors } = useTheme()

	const [loading, setLoading] = React.useState(false)

	const { signInWithEmail } = useAuth()

	const onSubmit = handleSubmit(async data => {
		setLoading(true)
		try {
			await signInWithEmail({ email: data.email, password: data.password })
			setLoading(false)
		} catch (error) {
			setLoading(false)
			Alert.alert(
				typeof error === 'object' &&
					error !== null &&
					'message' in error &&
					typeof error.message === 'string'
					? error.message
					: 'Something went wrong'
			)
		}
	})

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.background
				}}
			>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: colors.background
			}}
		>
			<Box mh={4}>
				<Text>Email</Text>
				<Controller
					control={control}
					rules={{
						required: true
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							placeholder="Your email"
							inputMode="email"
							autoComplete="email"
							autoFocus
							returnKeyType="next"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							// size="bigBody"
						/>
					)}
					name="email"
				/>
				{errors.email && <Text>This is required.</Text>}
			</Box>

			<Box>
				<Text>Password</Text>
				<Controller
					control={control}
					rules={{
						required: true
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							placeholder="Password"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoComplete="password"
							returnKeyType="send"
						/>
					)}
					name="password"
				/>
				{errors.password && <Text>This is required.</Text>}
			</Box>

			<Button title="Sign in" onPress={onSubmit} />
		</View>
	)
}
