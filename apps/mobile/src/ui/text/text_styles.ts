import _ from 'lodash'
import { StyleSheet } from 'react-native'
import type { ColorNames } from '@/ui/colors'
import { colors } from '@/ui/colors'
import { fontPixel } from '@/ui/normalizer'

type StylesObject<
	K extends string,
	N extends string | number,
	V extends string | number,
	S extends string
> = {
	[key in `${K}-${N}`]: Record<S, V>
}

const possibleSizes = {
	header: fontPixel(54),
	title: fontPixel(36),
	subtitle: fontPixel(24),
	bigBody: fontPixel(20),
	body: fontPixel(16),
	smallBody: fontPixel(14),
	caption: fontPixel(12),
	smol: fontPixel(8)
} as const
export type Size = keyof typeof possibleSizes
const sizeStylesObject = {} as StylesObject<'size', Size, number, 'fontSize'>
_.forEach(possibleSizes, (sizeValue, sizeName) => {
	sizeStylesObject[`size-${sizeName as Size}`] = {
		fontSize: sizeValue
	}
})

const colorStylesObject = {} as StylesObject<
	'color-dark' | 'color-light',
	ColorNames,
	string,
	'color'
>
_.forEach(colors.dark, (colorValue, colorName) => {
	colorStylesObject[`color-dark-${colorName as ColorNames}`] = {
		color: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	colorStylesObject[`color-light-${colorName as ColorNames}`] = {
		color: colorValue
	}
})

const possibleTextStyleValues = ['normal', 'italic'] as const
type TextStyle = (typeof possibleTextStyleValues)[number]
const textStyleStylesObject = {} as StylesObject<
	'textStyle',
	TextStyle,
	TextStyle,
	'fontStyle'
>
_.forEach(possibleTextStyleValues, textStyleValue => {
	textStyleStylesObject[`textStyle-${textStyleValue}`] = {
		fontStyle: textStyleValue
	}
})

const possibleAlignStyleValues = [
	'auto',
	'left',
	'right',
	'center',
	'justify'
] as const
type Align = (typeof possibleAlignStyleValues)[number]
const alignStylesObject = {} as StylesObject<'align', Align, Align, 'textAlign'>
_.forEach(possibleAlignStyleValues, alignValue => {
	alignStylesObject[`align-${alignValue}`] = {
		textAlign: alignValue
	}
})

const possibleWeightValues = [
	'normal',
	'bold',
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
	'900'
] as const
export type Weight = (typeof possibleWeightValues)[number]
const weightStylesObject = {} as StylesObject<
	'weight',
	Weight,
	Weight,
	'fontWeight'
>
_.forEach(possibleWeightValues, weightValue => {
	weightStylesObject[`weight-${weightValue}`] = {
		fontWeight: weightValue
	}
})

const possibleTextDecorationLineValues = [
	'none',
	'underline',
	'line-through'
] as const
export type TextDecorationLine =
	(typeof possibleTextDecorationLineValues)[number]
const textDecorationLineStylesObject = {} as StylesObject<
	'textDecorationLine',
	TextDecorationLine,
	TextDecorationLine,
	'textDecorationLine'
>
_.forEach(possibleTextDecorationLineValues, textDecorationLineValue => {
	textDecorationLineStylesObject[
		`textDecorationLine-${textDecorationLineValue}`
	] = {
		textDecorationLine: textDecorationLineValue
	}
})

const styles = StyleSheet.create({
	...colorStylesObject,
	...sizeStylesObject,
	...textStyleStylesObject,
	...weightStylesObject,
	...alignStylesObject,
	...textDecorationLineStylesObject
})

export { styles }
