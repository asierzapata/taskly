import React from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useColorScheme, Text as NativeText } from 'react-native'

/* ====================================================== */
/*                        Styles                          */
/* ====================================================== */

import { styles } from './text_styles'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { ColorNames } from '../colors'

type Size =
	| 'header'
	| 'title'
	| 'subtitle'
	| 'bigBody'
	| 'body'
	| 'smallBody'
	| 'caption'
type Color = ColorNames
type Weight =
	| 'normal'
	| 'bold'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900'
type TextStyle = 'normal' | 'italic'
type Align = 'left' | 'center' | 'right'
type TextDecorationLine = 'underline' | 'line-through'

type TextProps = {
	size?: Size
	color?: Color
	weight?: Weight
	textStyle?: TextStyle
	align?: Align
	textDecorationLine?: TextDecorationLine
	children: React.ReactNode
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Text = ({
	size = 'body',
	color = 'text',
	weight = 'normal',
	textStyle = 'normal',
	align,
	textDecorationLine,
	children
}: TextProps) => {
	const colorScheme = useColorScheme() || 'light'

	const computedStyles = React.useMemo(() => {
		const stylesArray = []

		console.log(
			'>>>>>>',
			size,
			color,
			weight,
			textStyle,
			align,
			textDecorationLine,
			colorScheme
		)

		if (size) {
			stylesArray.push(styles[`size-${size}`])
		}

		if (color) {
			console.log(
				'>>>>>>',
				colorScheme,
				color,
				styles[`color-${colorScheme}-${color}`]
			)
			stylesArray.push(styles[`color-${colorScheme}-${color}`])
		}

		if (weight) {
			stylesArray.push(styles[`weight-${weight}`])
		}

		if (textStyle) {
			stylesArray.push(styles[`textStyle-${textStyle}`])
		}

		if (align) {
			stylesArray.push(styles[`align-${align}`])
		}

		if (textDecorationLine) {
			stylesArray.push(styles[`textDecorationLine-${textDecorationLine}`])
		}

		return stylesArray
	}, [size, color, weight, textStyle, align, textDecorationLine, colorScheme])

	return <NativeText style={computedStyles}>{children}</NativeText>
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Text }
