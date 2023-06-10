import React from 'react'
import _ from 'lodash'

import type { BasicColorNames } from '@/ui/colors'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import type { ColorValue } from 'react-native'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { Box } from '@/ui/box'
import { colors } from '@/ui/colors'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const LOADING_SIZES = {
	SMALL: 'small',
	LARGE: 'large'
} as const

const Loading = ({
	fullscreen = false,
	color,
	negative = false,
	size = LOADING_SIZES.SMALL
}: {
	fullscreen?: boolean
	color?: BasicColorNames
	negative?: boolean
	size?: (typeof LOADING_SIZES)[keyof typeof LOADING_SIZES]
}) => {
	const colorScheme = useColorScheme()

	let activityIndicatorColor: ColorValue =
		colorScheme === 'dark' && !negative
			? colors.dark.loading
			: colors.light.loading
	if (color !== undefined) {
		activityIndicatorColor = colors.basicColors[color] as ColorValue
	}

	return (
		<Box flex={fullscreen ? 1 : undefined} justify="center" align="center">
			<ActivityIndicator size={size} color={activityIndicatorColor} />
		</Box>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Loading }
