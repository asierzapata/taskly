import React from 'react'
/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Text as NativeText, useColorScheme } from 'react-native'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { ColorNames } from '../colors'
/* ====================================================== */
/*                        Styles                          */
/* ====================================================== */

import { styles } from './text_styles'

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	as?: React.ComponentType<any>
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
	as: Component = NativeText,
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

		if (size) {
			stylesArray.push(styles[`size-${size}`])
		}

		if (color) {
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

	return <Component style={computedStyles}>{children}</Component>
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Text }
