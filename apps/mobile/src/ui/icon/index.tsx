import React from 'react'
import { useColorScheme, type ColorSchemeName } from 'react-native'
/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { pixelSizeVertical } from '@/ui/normalizer'
import type { LucideIcon } from 'lucide-react-native'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */ import {
	colors,
	type ColorNames
} from '../colors'

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
