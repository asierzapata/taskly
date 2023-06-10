import React from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { pixelSizeVertical } from '@/ui/normalizer'
import { colors } from '../colors'
import { useColorScheme } from 'react-native'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { ColorNames } from '../colors'
import type { ColorSchemeName } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Icon = ({
	icon,
	size,
	color,
	inverted
}: {
	icon: LucideIcon
	size: number
	color?: ColorNames
	inverted?: boolean
}) => {
	const colorScheme = useColorScheme() || 'light'
	const iconColor = _getIconColor({ color, colorScheme, inverted })
	const normalizedSize = pixelSizeVertical(size)
	return <Box as={icon} size={normalizedSize} color={iconColor} />
}

function _getIconColor({
	colorScheme,
	color,
	inverted = false
}: {
	colorScheme: NonNullable<ColorSchemeName>
	color?: ColorNames
	inverted?: boolean
}) {
	if (color) {
		return colors[colorScheme][color]
	}
	return inverted ? colors[colorScheme].textInverted : colors[colorScheme].text
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Icon }
