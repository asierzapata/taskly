import React from 'react'
import { Pressable } from 'react-native'
/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { Loading } from '@/ui/loading'
import { Text } from '@/ui/text'
import type { LucideIcon } from 'lucide-react-native'

import type { DarkColorNames, LightColorNames } from '../colors'
import { Icon } from '../icon'
import type { Size } from '../text/text_styles'

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
	icon?: LucideIcon
	iconSide?: 'left' | 'right'
	iconColor?: DarkColorNames | LightColorNames
	children: React.ReactNode
} & React.ComponentProps<typeof Box> &
	React.ComponentProps<typeof Pressable>

const Button = ({
	flavor = 'primary',
	size = 'm',
	loading = false,
	disabled = false,
	icon,
	iconSide = 'left',
	iconColor,
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
	let paddingHorizontal = 3
	let fontSize = 'body' as Size
	let iconSize = 16

	switch (size) {
		case 'l':
			paddingVertical = 3
			paddingHorizontal = 3
			fontSize = 'subtitle'
			iconSize = 24
			break
		case 'm':
			paddingVertical = 2
			paddingHorizontal = 2
			fontSize = 'body'
			iconSize = 20
			break
		case 's':
			paddingVertical = 1
			paddingHorizontal = 1
			fontSize = 'caption'
			iconSize = 16
			break
	}

	if (flavor === 'primary') {
		return (
			<Box
				as={Pressable}
				borderRadius={BUTTONS_BORDER_RADIUS}
				backgroundColor={disabled || loading ? 'primaryDeep' : 'primary'}
				flexDirection="row"
				align="center"
				justify="center"
				pv={paddingVertical}
				ph={paddingHorizontal}
				opacity={opacity}
				disabled={disabled || loading}
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				{...props}
			>
				{!!icon && iconSide === 'left' && (
					<Box mr={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
				)}
				{!loading && (
					<Text
						size={fontSize}
						color={disabled || loading ? 'textLight' : 'textInverted'}
					>
						{children}
					</Text>
				)}
				{!!icon && iconSide === 'right' && (
					<Box ml={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
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
				flexDirection="row"
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
				{!!icon && iconSide === 'left' && (
					<Box mr={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
				)}
				{!loading && <Text size={fontSize}>{children}</Text>}
				{!!icon && iconSide === 'right' && (
					<Box mr={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
				)}
				{loading && <Loading />}
			</Box>
		)
	}
	if (flavor === 'text') {
		return (
			<Box
				as={Pressable}
				borderRadius={BUTTONS_BORDER_RADIUS}
				flexDirection="row"
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
				{!!icon && iconSide === 'left' && (
					<Box mr={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
				)}
				{!loading && (
					<Text
						size={fontSize}
						color={disabled || loading ? 'textLight' : 'text'}
					>
						{children}
					</Text>
				)}
				{!!icon && iconSide === 'right' && (
					<Box mr={1}>
						<Icon
							icon={icon}
							size={iconSize}
							color={iconColor ?? 'textInverted'}
						/>
					</Box>
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
