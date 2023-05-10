import _ from 'lodash'

import type { BoxProps } from '.'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { styles } from './box_styles'

import type { RegisteredStyle } from 'react-native/types'

/* ====================================================== */
/*                     Implementation                     */
/* ====================================================== */

function calculateStyles(
	boxProps: BoxProps,
	{
		breakpoint,
		textDirection,
		colorScheme
	}: {
		breakpoint: Breakpoint
		textDirection: TextDirection
		colorScheme: 'light' | 'dark'
	}
) {
	const parseDefinedStylesForBreakpoint = (
		value: string,
		prefix: string,
		style: string
	) => parseDefinedStyles(value, prefix, style, breakpoint, colorScheme)

	const parseRawStylesForBreakpoint = (value, style) =>
		parseRawStyles(value, style, breakpoint, colorScheme)

	const _styles = [
		// BACKGROUNDS
		// -----------

		parseDefinedStylesForBreakpoint(
			boxProps.backgroundColor,
			'backgroundColor-',
			'backgroundColor'
		),

		// SIZES
		// -----

		parseRawStylesForBreakpoint(boxProps.w, 'width'),
		parseRawStylesForBreakpoint(boxProps.maxW, 'max-width'),
		parseRawStylesForBreakpoint(boxProps.minW, 'min-width'),
		parseRawStylesForBreakpoint(boxProps.h, 'height'),
		parseRawStylesForBreakpoint(boxProps.maxH, 'max-height'),
		parseRawStylesForBreakpoint(boxProps.minH, 'min-height'),

		// FLEXBOX
		// -------

		parseDefinedStylesForBreakpoint(boxProps.flex, 'flex-', 'flex'),
		parseDefinedStylesForBreakpoint(boxProps.flexGrow, 'flexGrow-', 'flexGrow'),
		parseDefinedStylesForBreakpoint(
			boxProps.flexShrink,
			'flexShrink-',
			'flexShrink'
		),
		parseDefinedStylesForBreakpoint(
			boxProps.justify,
			'justify-',
			'justify-content'
		),
		parseDefinedStylesForBreakpoint(boxProps.align, 'align-', 'alignItems'),
		parseRawStylesForBreakpoint(boxProps.gap, 'gap'),

		// OVERFLOWS
		// ---------

		parseDefinedStylesForBreakpoint(boxProps.overflow, 'overflow-', 'overflow'),

		// MARGINS
		// -------

		parseRawStylesForBreakpoint(boxProps.m, 'margin'),
		parseRawStylesForBreakpoint(boxProps.mt, 'marginTop'),
		parseRawStylesForBreakpoint(
			boxProps.me,
			textDirection === 'ltr' ? 'marginRight' : 'marginLeft'
		),
		parseRawStylesForBreakpoint(boxProps.mb, 'marginBottom'),
		parseRawStylesForBreakpoint(
			boxProps.ms,
			textDirection === 'ltr' ? 'marginLeft' : 'marginRight'
		),
		parseRawStylesForBreakpoint(boxProps.mh, 'marginHorizontal'),
		parseRawStylesForBreakpoint(boxProps.mv, 'marginVertical'),

		// PADDINGS
		// --------

		parseRawStylesForBreakpoint(boxProps.p, 'padding'),
		parseRawStylesForBreakpoint(boxProps.pt, 'paddingTop'),
		parseRawStylesForBreakpoint(
			boxProps.pe,
			textDirection === 'ltr' ? 'paddingRight' : 'paddingLeft'
		),
		parseRawStylesForBreakpoint(boxProps.pb, 'paddingBottom'),
		parseRawStylesForBreakpoint(
			boxProps.ps,
			textDirection === 'ltr' ? 'paddingLeft' : 'paddingRight'
		),
		parseRawStylesForBreakpoint(boxProps.ph, 'paddingHorizontal'),
		parseRawStylesForBreakpoint(boxProps.pv, 'paddingVertical'),

		// Z-INDEXES
		// ---------

		parseRawStylesForBreakpoint(boxProps.zIndex, 'zIndex'),

		// BORDERS
		// -------

		parseDefinedStylesForBreakpoint(
			boxProps.borderColor,
			'borderColor-',
			'borderColor'
		),
		parseDefinedStylesForBreakpoint(
			boxProps.borderStyle,
			'bor-',
			'border-style'
		),
		parseRawStylesForBreakpoint(boxProps.borderWidth, 'borderWidth'),
		parseRawStylesForBreakpoint(boxProps.borderRadius, 'borderRadius'),

		// OPACITY
		// -------

		parseRawStylesForBreakpoint(boxProps.opacity, 'opacity')
	] as RegisteredStyle<unknown>[]

	return _styles
}

/* ====================================================== */
/*                       Public API                       */
/* ====================================================== */

export { calculateStyles, parseDefinedStyles }

/* ====================================================== */
/*                         Helpers                        */
/* ====================================================== */

const BREAKPOINT_MODIFIERS = ['sm', 'md', 'lg', 'xl', '2xl'] as const

function parseDefinedStyles(
	value = '',
	prefix: string,
	style: string,
	breakpoint: Breakpoint,
	colorScheme: 'light' | 'dark'
) {
	if (_.isNull(value) || _.isUndefined(value)) return {}

	const parsedStyles = BREAKPOINT_MODIFIERS.map(() => ({
		idle: ''
	}))
	const breakpointIndex = _.indexOf(BREAKPOINT_MODIFIERS, breakpoint)
	let baseStyle = ''

	value
		.toString()
		.split(' ')
		.forEach(_value => {
			const items = _value.split(':')
			if (items.length === 1) {
				baseStyle = _value
			} else if (
				items.length === 2 &&
				_.includes(BREAKPOINT_MODIFIERS, items[0])
			) {
				const index = _.indexOf(BREAKPOINT_MODIFIERS, items[0])
				parsedStyles[index].idle = items[1]
			}
			throw new Error(
				`Invalid ${style} value: ${value}. Expected format: ${prefix}{breakpoint}:{value}`
			)
		})

	let defaultStyle = { idle: baseStyle }
	const breakpointStyles = parsedStyles.map(_style => {
		defaultStyle = { ...defaultStyle, ..._style }
		return defaultStyle
	})

	const breakpointStyle = breakpointStyles[breakpointIndex]

	return parseBreakpointStyle({ value: breakpointStyle, prefix, style })
}

function parseBreakpointStyle({
	value,
	prefix,
	style
}: {
	value: Record<string, string>
	prefix: string
	style: string
}) {
	let inlineStyle = {}
	let className = ''

	_.forEach(value, (v, modifier) => {
		const { className: _className, style: _inlineStyle } = parseStyle({
			value: v,
			prefix: modifier !== 'idle' ? `${prefix}${modifier}:` : prefix,
			style
		})
		if (_className) className += `${_className} `
		if (_inlineStyle && modifier === 'idle')
			inlineStyle = { ...inlineStyle, ..._inlineStyle }
	})

	return {
		className: _.trim(className) ? _.trim(className) : undefined,
		style: _.isEmpty(inlineStyle) ? undefined : inlineStyle
	}
}

function parseStyle({
	value,
	prefix,
	style
}: {
	value: string
	prefix: string
	style: string
}) {
	// Inline Styles
	// -------------

	if (_.startsWith(value, '[') && _.endsWith(value, ']')) {
		const _styles = {}
		const styleValue = value.replace(']', '').replace('[', '')
		style.split(',').forEach(_style => {
			_styles[_style] = styleValue
		})
		return { style: _styles }
	}

	// Classes
	// -------

	if (!value && !_.isFinite(value)) return {}

	return {
		className: value
			.toString()
			.split(' ')
			.map(_v => styles[`${prefix}${_v}`])
			.join(' ')
	}
}
