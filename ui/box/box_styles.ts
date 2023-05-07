import * as _ from 'lodash'
import { StyleSheet } from 'react-native'
import { colors, darkColors, lightColors } from '@/ui/colors'

type StylesObject<
	K extends string,
	V extends readonly (string | number)[],
	S extends string
> = {
	[key in `${K}-${V[number]}`]: Record<S, V[number]>
}

const possibleFlexValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const flexStylesObject = {} as StylesObject<
	'flex',
	typeof possibleFlexValues,
	'flex'
> &
	StylesObject<'flexGrow', typeof possibleFlexValues, 'flexGrow'> &
	StylesObject<'flexShrink', typeof possibleFlexValues, 'flexShrink'>
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

const possibleFlexDirectionValues = [
	'row',
	'column',
	'row-reverse',
	'column-reverse'
]
const flexDirectionStylesObject = {} as StylesObject<
	'flexDirection',
	typeof possibleFlexDirectionValues,
	'flexDirection'
>
possibleFlexDirectionValues.forEach(value => {
	flexDirectionStylesObject[`flexDirection-${value}`] = {
		flexDirection: value
	}
})

const darkColorNames = [...Object.keys(darkColors)]
const lightColorNames = [...Object.keys(lightColors)]
const backgroundColorStylesObject = {} as StylesObject<
	'backgroundColor-dark',
	typeof darkColorNames,
	'backgroundColor'
> &
	StylesObject<
		'backgroundColor-light',
		typeof lightColorNames,
		'backgroundColor'
	>
_.forEach(darkColors, (colorValue: string, colorName: string) => {
	backgroundColorStylesObject[`backgroundColor-dark-${colorName}`] = {
		backgroundColor: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	backgroundColorStylesObject[`backgroundColor-light-${colorName}`] = {
		backgroundColor: colorValue
	}
})

const borderColorStylesObject = {} as StylesObject<
	'borderColor-dark' | 'borderColor-light',
	typeof darkColorNames,
	'borderColor'
>
_.forEach(colors.dark, (colorValue, colorName) => {
	borderColorStylesObject[`borderColor-dark-${colorName}`] = {
		borderColor: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	borderColorStylesObject[`borderColor-light-${colorName}`] = {
		borderColor: colorValue
	}
})

const colorStylesObject = {} as {
	[key: string]: Record<string, string>
}
_.forEach(colors.dark, (colorValue, colorName) => {
	colorStylesObject[`color-dark-${colorName}`] = {
		color: colorValue
	}
})
_.forEach(colors.light, (colorValue, colorName) => {
	colorStylesObject[`color-light-${colorName}`] = {
		color: colorValue
	}
})

const possibleAlignValues = [
	'center',
	'flex-start',
	'flex-end',
	'stretch',
	'baseline'
]
const alignStylesObject = {} as { [key: string]: Record<string, string> }
_.forEach(possibleAlignValues, value => {
	alignStylesObject[`align-${value}`] = {
		alignItems: value
	}
})

const possibleJustifyValues = [
	'center',
	'flex-start',
	'flex-end',
	'space-between',
	'space-around',
	'space-evenly'
] as const
const justifyStylesObject = {} as {
	[K in `justify-${(typeof possibleJustifyValues)[number]}`]: Record<
		'justifyContent',
		string
	>
}
_.forEach(possibleJustifyValues, value => {
	justifyStylesObject[`justify-${value}`] = {
		justifyContent: value
	}
})

const possibleOverflowValues = ['visible', 'hidden']
const overflowStylesObject = {}
_.forEach(possibleOverflowValues, value => {
	overflowStylesObject[`overflow-${value}`] = {
		overflow: value
	}
})

const styles = StyleSheet.create({
	...flexStylesObject,
	...flexDirectionStylesObject,
	...colorStylesObject,
	...alignStylesObject,
	...justifyStylesObject,
	...overflowStylesObject,
	...borderColorStylesObject,
	...backgroundColorStylesObject,
	relative: {
		position: 'relative'
	},
	absolute: {
		position: 'absolute'
	}
})

export { styles }
