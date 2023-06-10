import * as React from 'react'
/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import {
	useColorScheme,
	View,
	type ColorSchemeName,
	type StyleProp
} from 'react-native'
/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { pixelUnitHorizontal, pixelUnitVertical } from '@/ui/normalizer'
import * as _ from 'lodash'

import {
	styles,
	type AlignValues,
	type DarkColorNames,
	type FlexDirectionValues,
	type FlexValues,
	type FlexWrapValues,
	type JustifyValues,
	type LightColorNames,
	type OverflowValues
} from './box_styles'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type Width = number | string
type MinWidth = Width
type Height = number | string
type MinHeight = Height
type Margin = number
type Padding = number
type Gap = number
type Opacity = string
type BorderRadius = string
type BorderWidth = string

export type BoxProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	as?: string | React.ComponentType<any>
	w?: Width
	minW?: MinWidth
	h?: Height
	minH?: MinHeight
	mt?: Margin
	mb?: Margin
	ml?: Margin
	mr?: Margin
	mv?: Margin
	mh?: Margin
	pt?: Padding
	pb?: Padding
	pl?: Padding
	pr?: Padding
	pv?: Padding
	ph?: Padding
	flex?: FlexValues
	flexGrow?: FlexValues
	flexShrink?: FlexValues
	flexDirection?: FlexDirectionValues
	flexWrap?: FlexWrapValues
	gap?: Gap
	align?: AlignValues
	justify?: JustifyValues
	backgroundColor?: DarkColorNames | LightColorNames
	borderColor?: DarkColorNames | LightColorNames
	borderWidth?: BorderWidth
	borderRadius?: BorderRadius
	overflow?: OverflowValues
	opacity?: Opacity
	children?: React.ReactNode
	style?: StyleProp<unknown>
	// This is a hack to allow any other props to be passed to the component `as`
	[key: string]: unknown
}

const Box = React.forwardRef(
	(
		{
			as: Component = View,
			w,
			minW,
			h,
			minH,
			mt,
			mb,
			ml,
			mr,
			mv,
			mh,
			pt,
			pb,
			pl,
			pr,
			ph,
			pv,
			flex,
			flexGrow,
			flexShrink,
			flexDirection,
			flexWrap,
			gap,
			align,
			justify,
			backgroundColor,
			borderColor,
			borderWidth,
			borderRadius,
			overflow,
			opacity,
			children,
			style,
			...props
		}: BoxProps,
		ref
	) => {
		const colorScheme = useColorScheme() || 'light'

		const computedStyles = React.useMemo(() => {
			return calculateStyles({
				w,
				minW,
				h,
				minH,
				mt,
				mb,
				ml,
				mr,
				mv,
				mh,
				pt,
				pb,
				pl,
				pr,
				pv,
				ph,
				flex,
				flexGrow,
				flexShrink,
				flexDirection,
				flexWrap,
				align,
				justify,
				gap,
				backgroundColor,
				colorScheme,
				borderColor,
				borderWidth,
				borderRadius,
				overflow,
				opacity,
				style
			})
		}, [
			w,
			minW,
			h,
			minH,
			mt,
			mb,
			ml,
			mr,
			mv,
			mh,
			pt,
			pb,
			pl,
			pr,
			pv,
			ph,
			flex,
			flexGrow,
			flexShrink,
			flexDirection,
			flexWrap,
			align,
			justify,
			gap,
			backgroundColor,
			colorScheme,
			borderColor,
			borderWidth,
			borderRadius,
			overflow,
			opacity,
			style
		])

		return (
			<Component ref={ref} style={computedStyles} {...props}>
				{children}
			</Component>
		)
	}
)

Box.displayName = 'Box'

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Box }

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

function calculateStyles({
	w,
	minW,
	h,
	minH,
	mt,
	mb,
	ml,
	mr,
	mv,
	mh,
	pt,
	pb,
	pl,
	pr,
	pv,
	ph,
	flex,
	flexGrow,
	flexShrink,
	flexDirection,
	flexWrap,
	gap,
	align,
	justify,
	backgroundColor,
	colorScheme,
	borderColor,
	borderWidth,
	borderRadius,
	overflow,
	opacity,
	style
}: {
	w?: Width
	minW?: MinWidth
	h?: Height
	minH?: MinHeight
	mt?: Margin
	mb?: Margin
	ml?: Margin
	mr?: Margin
	mv?: Margin
	mh?: Margin
	pt?: Padding
	pb?: Padding
	pl?: Padding
	pr?: Padding
	pv?: Padding
	ph?: Padding
	flex?: FlexValues
	flexGrow?: FlexValues
	flexShrink?: FlexValues
	flexDirection?: FlexDirectionValues
	flexWrap?: FlexWrapValues
	gap?: Gap
	align?: AlignValues
	justify?: JustifyValues
	backgroundColor?: DarkColorNames | LightColorNames
	borderColor?: DarkColorNames | LightColorNames
	borderWidth?: BorderWidth
	borderRadius?: BorderRadius
	overflow?: OverflowValues
	opacity?: Opacity
	style?: StyleProp<unknown>
	colorScheme: NonNullable<ColorSchemeName>
}) {
	const stylesArray = []

	if (w) {
		stylesArray.push({
			width: _.isNumber(w) && _.isFinite(w) ? pixelUnitHorizontal(w) : w
		})
	}

	if (minW) {
		stylesArray.push({
			minWidth:
				_.isNumber(minW) && _.isFinite(minW) ? pixelUnitHorizontal(minW) : minW
		})
	}

	if (h) {
		stylesArray.push({
			height: _.isNumber(h) && _.isFinite(h) ? pixelUnitHorizontal(h) : h
		})
	}

	if (minH) {
		stylesArray.push({
			height:
				_.isNumber(minH) && _.isFinite(minH) ? pixelUnitHorizontal(minH) : minH
		})
	}

	if (mt && _.isFinite(mt)) {
		stylesArray.push({ marginTop: pixelUnitVertical(mt) })
	}

	if (mb && _.isFinite(mb)) {
		stylesArray.push({ marginBottom: pixelUnitVertical(mb) })
	}

	if (ml && _.isFinite(ml)) {
		stylesArray.push({ marginLeft: pixelUnitVertical(ml) })
	}

	if (mr && _.isFinite(mr)) {
		stylesArray.push({ marginRight: pixelUnitVertical(mr) })
	}

	if (mv && _.isFinite(mv)) {
		stylesArray.push({ marginVertical: pixelUnitVertical(mv) })
	}

	if (mh && _.isFinite(mh)) {
		stylesArray.push({ marginHorizontal: pixelUnitHorizontal(mh) })
	}

	if (pt && _.isFinite(pt)) {
		stylesArray.push({ paddingTop: pixelUnitHorizontal(pt) })
	}

	if (pb && _.isFinite(pb)) {
		stylesArray.push({ paddingBottom: pixelUnitHorizontal(pb) })
	}

	if (pl && _.isFinite(pl)) {
		stylesArray.push({ paddingLeft: pixelUnitVertical(pl) })
	}

	if (pr && _.isFinite(pr)) {
		stylesArray.push({ paddingRight: pixelUnitHorizontal(pr) })
	}

	if (pv && _.isFinite(pv)) {
		stylesArray.push({ paddingVertical: pixelUnitVertical(pv) })
	}

	if (ph && _.isFinite(ph)) {
		stylesArray.push({ paddingHorizontal: pixelUnitHorizontal(ph) })
	}

	if (flex && styles[`flex-${flex}`]) {
		stylesArray.push(styles[`flex-${flex}`])
	}

	if (flexGrow && styles[`flexGrow-${flexGrow}`]) {
		stylesArray.push(styles[`flexGrow-${flexGrow}`])
	}

	if (flexShrink && styles[`flexShrink-${flexShrink}`]) {
		stylesArray.push(styles[`flexShrink-${flexShrink}`])
	}

	if (flexDirection && styles[`flexDirection-${flexDirection}`]) {
		stylesArray.push(styles[`flexDirection-${flexDirection}`])
	}

	if (flexWrap && styles[`flexWrap-${flexWrap}`]) {
		stylesArray.push(styles[`flexWrap-${flexWrap}`])
	}

	if (gap && _.isFinite(gap)) {
		stylesArray.push({ gap: pixelUnitHorizontal(gap) })
	}

	if (align && styles[`align-${align}`]) {
		stylesArray.push(styles[`align-${align}`])
	}

	if (justify && styles[`justify-${justify}`]) {
		stylesArray.push(styles[`justify-${justify}`])
	}

	if (
		backgroundColor &&
		styles[`backgroundColor-${colorScheme}-${backgroundColor}`]
	) {
		stylesArray.push(
			styles[`backgroundColor-${colorScheme}-${backgroundColor}`]
		)
	}

	if (borderColor && styles[`borderColor-${colorScheme}-${borderColor}`]) {
		stylesArray.push(styles[`borderColor-${colorScheme}-${borderColor}`])
	}

	if (borderWidth) {
		stylesArray.push({ borderWidth })
	}

	if (borderRadius) {
		stylesArray.push({ borderRadius })
	}

	if (opacity) {
		stylesArray.push({ opacity })
	}

	if (overflow && styles[`overflow-${overflow}`]) {
		stylesArray.push(styles[`overflow-${overflow}`])
	}

	if (style) {
		stylesArray.push(style)
	}

	return stylesArray
}
