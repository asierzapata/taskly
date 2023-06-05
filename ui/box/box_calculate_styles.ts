// import _ from 'lodash'

// import type { BoxProps } from '.'

// /* ====================================================== */
// /*                         Styles                         */
// /* ====================================================== */

// import { styles } from './box_styles'

// import type { RegisteredStyle } from 'react-native'

// /* ====================================================== */
// /*                     Implementation                     */
// /* ====================================================== */

// function calculateStyles(
// 	boxProps: BoxProps,
// 	{
// 		breakpoint,
// 		textDirection,
// 		colorScheme
// 	}: {
// 		breakpoint: Breakpoint
// 		textDirection: TextDirection
// 		colorScheme: 'light' | 'dark'
// 	}
// ) {
// 	const parseDefinedStylesForBreakpoint = (
// 		prefix: string,
// 		style: string,
// 		value?: string
// 	) => parseDefinedStyles({ value, prefix, style, breakpoint, colorScheme })

// 	const parseRawStylesForBreakpoint = (style: string, value?: string) =>
// 		parseRawStyles({ value, style, breakpoint, colorScheme })

// 	const _styles = [
// 		// BACKGROUNDS
// 		// -----------

// 		parseDefinedStylesForBreakpoint(
// 			'backgroundColor-',
// 			'backgroundColor',
// 			boxProps.backgroundColor
// 		),

// 		// SIZES
// 		// -----

// 		parseRawStylesForBreakpoint('width', boxProps.w),
// 		parseRawStylesForBreakpoint('max-width', boxProps.maxW),
// 		parseRawStylesForBreakpoint('min-width', boxProps.minW),
// 		parseRawStylesForBreakpoint('height', boxProps.h),
// 		parseRawStylesForBreakpoint('max-height', boxProps.maxH),
// 		parseRawStylesForBreakpoint('min-height', boxProps.minH),

// 		// FLEXBOX
// 		// -------

// 		parseDefinedStylesForBreakpoint('flex-', 'flex', boxProps.flex),
// 		parseDefinedStylesForBreakpoint('flexGrow-', 'flexGrow', boxProps.flexGrow),
// 		parseDefinedStylesForBreakpoint(
// 			'flexShrink-',
// 			'flexShrink',
// 			boxProps.flexShrink
// 		),
// 		parseDefinedStylesForBreakpoint(
// 			'justify-',
// 			'justify-content',
// 			boxProps.justify
// 		),
// 		parseDefinedStylesForBreakpoint('align-', 'alignItems', boxProps.align),
// 		parseRawStylesForBreakpoint('gap', boxProps.gap),

// 		// OVERFLOWS
// 		// ---------

// 		parseDefinedStylesForBreakpoint('overflow-', 'overflow', boxProps.overflow),

// 		// MARGINS
// 		// -------

// 		parseRawStylesForBreakpoint('margin', boxProps.m),
// 		parseRawStylesForBreakpoint('marginTop', boxProps.mt),
// 		parseRawStylesForBreakpoint(
// 			textDirection === 'ltr' ? 'marginRight' : 'marginLeft',
// 			boxProps.me
// 		),
// 		parseRawStylesForBreakpoint('marginBottom', boxProps.mb),
// 		parseRawStylesForBreakpoint(
// 			textDirection === 'ltr' ? 'marginLeft' : 'marginRight',
// 			boxProps.ms
// 		),
// 		parseRawStylesForBreakpoint('marginHorizontal', boxProps.mh),
// 		parseRawStylesForBreakpoint('marginVertical', boxProps.mv),

// 		// PADDINGS
// 		// --------

// 		parseRawStylesForBreakpoint('padding', boxProps.p),
// 		parseRawStylesForBreakpoint('paddingTop', boxProps.pt),
// 		parseRawStylesForBreakpoint(
// 			textDirection === 'ltr' ? 'paddingRight' : 'paddingLeft',
// 			boxProps.pe
// 		),
// 		parseRawStylesForBreakpoint('paddingBottom', boxProps.pb),
// 		parseRawStylesForBreakpoint(
// 			textDirection === 'ltr' ? 'paddingLeft' : 'paddingRight',
// 			boxProps.ps
// 		),
// 		parseRawStylesForBreakpoint('paddingHorizontal', boxProps.ph),
// 		parseRawStylesForBreakpoint('paddingVertical', boxProps.pv),

// 		// Z-INDEXES
// 		// ---------

// 		parseRawStylesForBreakpoint('zIndex', boxProps.zIndex),

// 		// BORDERS
// 		// -------

// 		parseDefinedStylesForBreakpoint(
// 			'borderColor-',
// 			'borderColor',
// 			boxProps.borderColor
// 		),
// 		parseDefinedStylesForBreakpoint(
// 			'bor-',
// 			'border-style',
// 			boxProps.borderStyle
// 		),
// 		parseRawStylesForBreakpoint('borderWidth', boxProps.borderWidth),
// 		parseRawStylesForBreakpoint('borderRadius', boxProps.borderRadius),

// 		// OPACITY
// 		// -------

// 		parseRawStylesForBreakpoint('opacity', boxProps.opacity)
// 	] as RegisteredStyle<unknown>[]

// 	return _styles
// }

// /* ====================================================== */
// /*                       Public API                       */
// /* ====================================================== */

// export { calculateStyles, parseDefinedStyles }

// /* ====================================================== */
// /*                         Helpers                        */
// /* ====================================================== */

// const BREAKPOINT_MODIFIERS = ['sm', 'md', 'lg', 'xl', '2xl'] as const

// function parseDefinedStyles({
// 	value = '',
// 	prefix,
// 	breakpoint,
// 	colorScheme,
// 	style
// }: {
// 	prefix: string
// 	breakpoint: Breakpoint
// 	colorScheme: 'light' | 'dark'
// 	value?: string
// 	style?: string
// }) {
// 	if (_.isNull(value) || _.isUndefined(value)) return {}

// 	const parsedStyles = BREAKPOINT_MODIFIERS.map(() => ({
// 		idle: ''
// 	}))
// 	const breakpointIndex = _.indexOf(BREAKPOINT_MODIFIERS, breakpoint)
// 	let baseStyle = ''

// 	value
// 		.toString()
// 		.split(' ')
// 		.forEach(_value => {
// 			const items = _value.split(':')
// 			if (items.length === 1) {
// 				baseStyle = _value
// 			} else if (
// 				items.length === 2 &&
// 				_.includes(BREAKPOINT_MODIFIERS, items[0])
// 			) {
// 				const index = _.indexOf(BREAKPOINT_MODIFIERS, items[0])
// 				parsedStyles[index].idle = items[1]
// 			}
// 			throw new Error(
// 				`Invalid ${style} value: ${value}. Expected format: ${prefix}{breakpoint}:{value}`
// 			)
// 		})

// 	let defaultStyle = { idle: baseStyle }
// 	const breakpointStyles = parsedStyles.map(_style => {
// 		defaultStyle = { ...defaultStyle, ..._style }
// 		return defaultStyle
// 	})

// 	const breakpointStyle = breakpointStyles[breakpointIndex]

// 	return parseBreakpointStyle({ value: breakpointStyle, prefix, style })
// }

// function parseBreakpointStyle({
// 	value,
// 	prefix,
// 	style
// }: {
// 	value: Record<string, string>
// 	prefix: string
// 	style?: string
// }) {
// 	let inlineStyle = {}
// 	let className = ''

// 	_.forEach(value, (v, modifier) => {
// 		const { className: _className, style: _inlineStyle } = parseStyle({
// 			value: v,
// 			prefix: modifier !== 'idle' ? `${prefix}${modifier}:` : prefix,
// 			style
// 		})
// 		if (_className) className += `${_className} `
// 		if (_inlineStyle && modifier === 'idle')
// 			inlineStyle = { ...inlineStyle, ..._inlineStyle }
// 	})

// 	return {
// 		className: _.trim(className) ? _.trim(className) : undefined,
// 		style: _.isEmpty(inlineStyle) ? undefined : inlineStyle
// 	}
// }

// function parseStyle({
// 	value,
// 	prefix,
// 	style
// }: {
// 	value: string
// 	prefix: string
// 	style?: string
// }) {
// 	// Inline Styles
// 	// -------------

// 	if (_.startsWith(value, '[') && _.endsWith(value, ']')) {
// 		const _styles = {}
// 		const styleValue = value.replace(']', '').replace('[', '')
// 		style.split(',').forEach(_style => {
// 			_styles[_style] = styleValue
// 		})
// 		return { style: _styles }
// 	}

// 	// Classes
// 	// -------

// 	if (!value && !_.isFinite(value)) return {}

// 	return {
// 		className: value
// 			.toString()
// 			.split(' ')
// 			.map(_v => styles[`${prefix}${_v}`])
// 			.join(' ')
// 	}
// }
