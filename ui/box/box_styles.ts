import * as _ from 'lodash'
import { StyleSheet } from 'react-native'
import { colors, darkColors, lightColors } from '@/ui/colors'

type StylesObject<
	K extends string,
	V extends string | number,
	S extends string
> = {
	[key in `${K}-${V}`]: Record<S, V>
}

type ColoredStylesObject<
	K extends string,
	N extends string | number,
	V extends string | number,
	S extends string
> = {
	[key in `${K}-${N}`]: Record<S, V>
}

export const possibleFlexValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export type FlexValues = (typeof possibleFlexValues)[number]
const flexStylesObject = {} as StylesObject<'flex', FlexValues, 'flex'> &
	StylesObject<'flexGrow', FlexValues, 'flexGrow'> &
	StylesObject<'flexShrink', FlexValues, 'flexShrink'>
possibleFlexValues.forEach(value => {
	flexStylesObject[`flex-${value}`] = {
		flex: value
	}
	flexStylesObject[`flexGrow-${value}`] = {
		flexGrow: value
	}
	flexStylesObject[`flexShrink-${value}`] = {
		flexShrink: value
	}
})

export const possibleFlexDirectionValues = [
	'row',
	'column',
	'row-reverse',
	'column-reverse'
] as const
export type FlexDirectionValues = (typeof possibleFlexDirectionValues)[number]
const flexDirectionStylesObject = {} as StylesObject<
	'flexDirection',
	FlexDirectionValues,
	'flexDirection'
>
possibleFlexDirectionValues.forEach(value => {
	flexDirectionStylesObject[`flexDirection-${value}`] = {
		flexDirection: value
	}
})

const darkColorNames = [...Object.keys(darkColors)] as Array<
	keyof typeof darkColors
>
const darkColorValues = [...Object.values(darkColors)] as Array<
	(typeof darkColors)[keyof typeof darkColors]
>
export type DarkColorNames = (typeof darkColorNames)[number]
export type DarkColorValues = (typeof darkColorValues)[number]

const lightColorNames = [...Object.keys(lightColors)] as Array<
	keyof typeof lightColors
>
const lightColorValues = [...Object.values(lightColors)] as Array<
	(typeof lightColors)[keyof typeof lightColors]
>
export type LightColorNames = (typeof lightColorNames)[number]
export type LightColorValues = (typeof lightColorValues)[number]

const backgroundColorStylesObject = {} as ColoredStylesObject<
	'backgroundColor-dark',
	DarkColorNames,
	DarkColorValues,
	'backgroundColor'
> &
	ColoredStylesObject<
		'backgroundColor-light',
		LightColorNames,
		LightColorValues,
		'backgroundColor'
	>
_.forEach(colors.dark, (colorValue, colorName) => {
	if (!_.includes(darkColorNames, colorName)) return
	const _colorName = colorName as DarkColorNames
	backgroundColorStylesObject[`backgroundColor-dark-${_colorName}`] = {
		backgroundColor: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	if (!_.includes(lightColorNames, colorName)) return
	const _colorName = colorName as LightColorNames
	backgroundColorStylesObject[`backgroundColor-light-${_colorName}`] = {
		backgroundColor: colorValue
	}
})

const borderColorStylesObject = {} as ColoredStylesObject<
	'borderColor-dark',
	DarkColorNames,
	DarkColorValues,
	'borderColor'
> &
	ColoredStylesObject<
		'borderColor-light',
		LightColorNames,
		LightColorValues,
		'borderColor'
	>
_.forEach(colors.dark, (colorValue, colorName) => {
	if (!_.includes(darkColorNames, colorName)) return
	const _colorName = colorName as DarkColorNames
	borderColorStylesObject[`borderColor-dark-${_colorName}`] = {
		borderColor: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	if (!_.includes(lightColorNames, colorName)) return
	const _colorName = colorName as LightColorNames
	borderColorStylesObject[`borderColor-light-${_colorName}`] = {
		borderColor: colorValue
	}
})

const colorStylesObject = {} as ColoredStylesObject<
	'color-dark',
	DarkColorNames,
	DarkColorValues,
	'color'
> &
	ColoredStylesObject<'color-light', LightColorNames, LightColorValues, 'color'>
_.forEach(colors.dark, (colorValue, colorName) => {
	if (!_.includes(darkColorNames, colorName)) return
	const _colorName = colorName as DarkColorNames
	colorStylesObject[`color-dark-${_colorName}`] = {
		color: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	if (!_.includes(lightColorNames, colorName)) return
	const _colorName = colorName as LightColorNames
	colorStylesObject[`color-light-${_colorName}`] = {
		color: colorValue
	}
})

export const possibleAlignValues = [
	'center',
	'flex-start',
	'flex-end',
	'stretch',
	'baseline'
] as const
export type AlignValues = (typeof possibleAlignValues)[number]
const alignStylesObject = {} as StylesObject<'align', AlignValues, 'alignItems'>
_.forEach(possibleAlignValues, value => {
	alignStylesObject[`align-${value}`] = {
		alignItems: value
	}
})

export const possibleJustifyValues = [
	'center',
	'flex-start',
	'flex-end',
	'space-between',
	'space-around',
	'space-evenly'
] as const
export type JustifyValues = (typeof possibleJustifyValues)[number]
const justifyStylesObject = {} as StylesObject<
	'justify',
	JustifyValues,
	'justifyContent'
>
_.forEach(possibleJustifyValues, value => {
	justifyStylesObject[`justify-${value}`] = {
		justifyContent: value
	}
})

export const possibleOverflowValues = ['visible', 'hidden'] as const
export type OverflowValues = (typeof possibleOverflowValues)[number]
const overflowStylesObject = {} as StylesObject<
	'overflow',
	OverflowValues,
	'overflow'
>
_.forEach(possibleOverflowValues, value => {
	overflowStylesObject[`overflow-${value}`] = {
		overflow: value
	}
})

const mergedStylesObject = {
	...flexStylesObject,
	...flexDirectionStylesObject,
	...colorStylesObject,
	...alignStylesObject,
	...justifyStylesObject,
	...overflowStylesObject,
	...borderColorStylesObject,
	...backgroundColorStylesObject
}

const styles = StyleSheet.create(mergedStylesObject)

export { styles }
