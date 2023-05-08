const basicColors = {
	darkTangerine: '#FCA311',
	charcoal: '#2E4052',
	platinum: '#E5E5E5',
	chineseBlack: '#131619',
	onyx: '#353940',
	deepCarminePink: '#FF3333',
	electricGreen: '#00CC00',
	maximumYellowRed: '#f0ad4e',
	jasperOrange: '#d89c46',
	ultramarineBlue: '#4747FF'
} as const

const darkColors = {
	primary: basicColors.darkTangerine,
	secondary: basicColors.charcoal,
	text: basicColors.platinum,
	background: basicColors.chineseBlack,
	card: basicColors.onyx,
	border: basicColors.chineseBlack,
	headerText: basicColors.platinum,
	headerIcon: basicColors.platinum,
	notification: basicColors.darkTangerine,
	danger: basicColors.deepCarminePink,
	success: basicColors.electricGreen,
	warning: basicColors.maximumYellowRed,
	info: basicColors.ultramarineBlue,
	loading: basicColors.darkTangerine,
	...basicColors
} as const

const lightColors = {
	primary: basicColors.darkTangerine,
	secondary: basicColors.charcoal,
	text: basicColors.chineseBlack,
	background: basicColors.platinum,
	card: basicColors.platinum,
	border: basicColors.charcoal,
	headerText: basicColors.charcoal,
	headerIcon: basicColors.charcoal,
	notification: basicColors.darkTangerine,
	danger: basicColors.deepCarminePink,
	success: basicColors.electricGreen,
	warning: basicColors.jasperOrange,
	info: basicColors.ultramarineBlue,
	loading: basicColors.chineseBlack,
	...basicColors
} as const

const colors = {
	dark: darkColors,
	light: lightColors,
	basicColors
} as const

const darkColorNames = [...Object.keys(darkColors)] as Array<
	keyof typeof darkColors
>
type DarkColorNames = (typeof darkColorNames)[number]

const lightColorNames = [...Object.keys(lightColors)] as Array<
	keyof typeof lightColors
>
type LightColorNames = (typeof lightColorNames)[number]

const basicColorNames = [...Object.keys(basicColors)] as Array<
	keyof typeof basicColors
>
type BasicColorNames = (typeof basicColorNames)[number]

type ColorNames = DarkColorNames | LightColorNames

/**
 * primary (string): The primary color of the app used to tint various elements. Usually you'll want to use your brand color for this.
 * background (string): The color of various backgrounds, such as background color for the screens.
 * card (string): The background color of card-like elements, such as headers, tab bars etc.
 * text (string): The text color of various elements.
 * border (string): The color of borders, e.g. header border, tab bar border etc.
 * notification (string): The color of Tab Navigator badge.
 */

const darkNavigationTheme = {
	dark: true,
	colors: {
		primary: colors.dark.primary,
		background: colors.dark.background,
		card: colors.dark.card,
		text: colors.dark.text,
		border: colors.dark.border,
		notification: colors.dark.notification
	}
} as const

const lightNavigationTheme = {
	dark: false,
	colors: {
		primary: colors.light.secondary,
		background: colors.light.background,
		card: colors.light.card,
		text: colors.light.text,
		border: colors.light.border,
		notification: colors.light.notification
	}
} as const

export {
	colors,
	darkColors,
	lightColors,
	darkNavigationTheme,
	lightNavigationTheme,
	BasicColorNames,
	DarkColorNames,
	LightColorNames,
	ColorNames
}
