import React from 'react'

/* ====================================================== */
/*                         Hooks                          */
/* ====================================================== */

import { useAuth } from '@/services/authentication'
import { useTheme } from '@react-navigation/native'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { TextInput } from '@/ui/form/text_input'
import { Box } from '@/ui/box'
import { Text } from '@/ui/text'
import {
	View,
	Alert,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Keyboard
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/ui/button'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

type FormData = {
	email: string
	password: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

export default function SignIn() {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm<FormData>({
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const passwordInputRef = React.useRef(null)

	const { colors } = useTheme()

	const [loading, setLoading] = React.useState(false)

	const { signInWithEmail } = useAuth()

	const onSubmit = handleSubmit(async data => {
		console.log('>>>>>> SUBMIT', data)
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

	console.log('>>>>>>', errors)

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
		<Box
			as={KeyboardAvoidingView}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			flex={1}
		>
			<Box
				as={TouchableWithoutFeedback}
				accessible={false}
				onPress={Keyboard.dismiss}
			>
				<Box h="100%" justifyContent="center" alignItems="center">
					<Box w="50%" gap={2}>
						<Text size="caption" weight="bold">
							Email
						</Text>
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
									// autoFocus
									autoCapitalize="none"
									returnKeyType="next"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									onSubmitEditing={() => {
										if (passwordInputRef.current)
											passwordInputRef.current.focus()
									}}
								/>
							)}
							name="email"
						/>
						{errors.email && (
							<Text size="caption" color="danger">
								Email is required
							</Text>
						)}
					</Box>

					<Box w="50%" gap={2} mt={4}>
						<Text size="caption" weight="bold">
							Password
						</Text>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									ref={passwordInputRef}
									placeholder="Password"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									autoComplete="password"
									returnKeyType="send"
									secureTextEntry
									onSubmitEditing={onSubmit}
								/>
							)}
							name="password"
						/>
						{errors.password && (
							<Text size="caption" color="danger">
								Password is required
							</Text>
						)}
					</Box>

					<Box w="50%" gap={2} mt={4}>
						<Button
							loading={loading}
							disabled={loading || Object.keys(errors).length > 0 || !isValid}
							onPress={onSubmit}
							style={{
								zIndex: 1000
							}}
						>
							Sign in
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
