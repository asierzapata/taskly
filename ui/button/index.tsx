import React from 'react'

import type { Size } from '../text/text_styles'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { Loading } from '@/ui/loading'
import { Text } from '@/ui/text'
import { Pressable } from 'react-native'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type Flavors = 'primary' | 'outlined' | 'text'

type Sizes = 'l' | 'm' | 's'

const BUTTONS_BORDER_RADIUS = 3

type ButtonProps = {
	flavor?: Flavors
	size?: Sizes
	loading?: boolean
	disabled?: boolean
	onPress?: () => void
	onLongPress?: () => void
	children: React.ReactNode
} & React.ComponentProps<typeof Box> &
	React.ComponentProps<typeof Pressable>

const Button = ({
	flavor = 'primary',
	size = 'm',
	loading = false,
	disabled = false,
	onPress,
	onLongPress,
	children,
	...props
}: ButtonProps) => {
	const [pressed, setPressed] = React.useState(false)

	const handlePressIn = React.useCallback(() => {
		setPressed(true)
	}, [])

	const handlePressOut = React.useCallback(() => {
		setPressed(false)
	}, [])

	const opacity = pressed ? 0.75 : 1

	let paddingVertical = 3
	let fontSize = 'body' as Size

	switch (size) {
		case 'l':
			paddingVertical = 3
			fontSize = 'subtitle'
			break
		case 'm':
			paddingVertical = 2
			fontSize = 'body'
			break
		case 's':
			paddingVertical = 1
			fontSize = 'caption'
			break
	}

	if (flavor === 'primary') {
		return (
			<Box
				as={Pressable}
				borderRadius={BUTTONS_BORDER_RADIUS}
				backgroundColor={disabled || loading ? 'primaryDeep' : 'primary'}
				align="center"
				justify="center"
				pv={paddingVertical}
				opacity={opacity}
				disabled={disabled || loading}
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				{...props}
			>
				{!loading && (
					<Text
						size={fontSize}
						color={disabled || loading ? 'textLight' : 'textInverted'}
					>
						{children}
					</Text>
				)}
				{loading && <Loading negative />}
			</Box>
		)
	}
	if (flavor === 'outlined') {
		return (
			<Box
				as={Pressable}
				borderRadius={BUTTONS_BORDER_RADIUS}
				borderWidth={1}
				borderColor={disabled || loading ? 'primaryDeep' : 'primary'}
				backgroundColor="background"
				align="center"
				justify="center"
				opacity={opacity}
				disabled={disabled || loading}
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				{...props}
			>
				{!loading && <Text size={fontSize}>{children}</Text>}
				{loading && <Loading />}
			</Box>
		)
	}
	if (flavor === 'text') {
		return (
			<Box
				as={Pressable}
				borderRadius={BUTTONS_BORDER_RADIUS}
				align="center"
				justify="center"
				opacity={opacity}
				disabled={disabled || loading}
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				{...props}
			>
				{!loading && (
					<Text
						textDecorationLine="underline"
						size={fontSize}
						color={disabled || loading ? 'textLight' : 'text'}
					>
						{children}
					</Text>
				)}
				{loading && <Loading />}
			</Box>
		)
	}

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Button }
