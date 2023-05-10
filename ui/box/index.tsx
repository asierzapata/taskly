import * as React from 'react'
import * as _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import type { ColorSchemeName, RegisteredStyle, StyleProp } from 'react-native'
import { useColorScheme, View } from 'react-native'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { pixelUnitHorizontal, pixelUnitVertical } from '@/ui/normalizer'
import {
	type AlignValues,
	type FlexDirectionValues,
	type FlexValues,
	type JustifyValues,
	type OverflowValues,
	type DarkColorNames,
	type LightColorNames,
	styles
} from './box_styles'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type Width = string
type MinWidth = Width
type Height = string
type MinHeight = Height
type Margin = string
type Padding = string
type Gap = string
type Opacity = string
type BorderRadius = string
type BorderWidth = string

// type ScreenSizeModifier = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type StyleWithScreenSizeModifier<T extends string> = T | `${T} ${string}`
// | `${T} ${ScreenSizeModifier}:${T}`
// | `${T} ${ScreenSizeModifier}:${T} ${ScreenSizeModifier}:${T}`
// | `${T} ${ScreenSizeModifier}:${T} ${ScreenSizeModifier}:${T} ${ScreenSizeModifier}:${T}`

export type BoxProps = {
	as?: string | React.ComponentType<any>
	w?: StyleWithScreenSizeModifier<Width>
	minW?: StyleWithScreenSizeModifier<MinWidth>
	h?: StyleWithScreenSizeModifier<Height>
	minH?: StyleWithScreenSizeModifier<MinHeight>
	mt?: StyleWithScreenSizeModifier<Margin>
	mb?: StyleWithScreenSizeModifier<Margin>
	ml?: StyleWithScreenSizeModifier<Margin>
	mr?: StyleWithScreenSizeModifier<Margin>
	mv?: StyleWithScreenSizeModifier<Margin>
	mh?: StyleWithScreenSizeModifier<Margin>
	pt?: StyleWithScreenSizeModifier<Padding>
	pb?: StyleWithScreenSizeModifier<Padding>
	pl?: StyleWithScreenSizeModifier<Padding>
	pr?: StyleWithScreenSizeModifier<Padding>
	pv?: StyleWithScreenSizeModifier<Padding>
	ph?: StyleWithScreenSizeModifier<Padding>
	flex?: StyleWithScreenSizeModifier<FlexValues>
	flexGrow?: StyleWithScreenSizeModifier<FlexValues>
	flexShrink?: StyleWithScreenSizeModifier<FlexValues>
	flexDirection?: StyleWithScreenSizeModifier<FlexDirectionValues>
	gap?: StyleWithScreenSizeModifier<Gap>
	align?: StyleWithScreenSizeModifier<AlignValues>
	justify?: StyleWithScreenSizeModifier<JustifyValues>
	backgroundColor?: DarkColorNames | LightColorNames
	borderColor?: DarkColorNames | LightColorNames
	borderWidth?: StyleWithScreenSizeModifier<BorderWidth>
	borderRadius?: StyleWithScreenSizeModifier<BorderRadius>
	overflow?: StyleWithScreenSizeModifier<OverflowValues>
	opacity?: StyleWithScreenSizeModifier<Opacity>
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

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Box }

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

// TODO: Move this to the box styles calculation file
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
	w?: StyleWithScreenSizeModifier<Width>
	minW?: StyleWithScreenSizeModifier<MinWidth>
	h?: StyleWithScreenSizeModifier<Height>
	minH?: StyleWithScreenSizeModifier<MinHeight>
	mt?: StyleWithScreenSizeModifier<Margin>
	mb?: StyleWithScreenSizeModifier<Margin>
	ml?: StyleWithScreenSizeModifier<Margin>
	mr?: StyleWithScreenSizeModifier<Margin>
	mv?: StyleWithScreenSizeModifier<Margin>
	mh?: StyleWithScreenSizeModifier<Margin>
	pt?: StyleWithScreenSizeModifier<Padding>
	pb?: StyleWithScreenSizeModifier<Padding>
	pl?: StyleWithScreenSizeModifier<Padding>
	pr?: StyleWithScreenSizeModifier<Padding>
	pv?: StyleWithScreenSizeModifier<Padding>
	ph?: StyleWithScreenSizeModifier<Padding>
	flex?: StyleWithScreenSizeModifier<FlexValues>
	flexGrow?: StyleWithScreenSizeModifier<FlexValues>
	flexShrink?: StyleWithScreenSizeModifier<FlexValues>
	flexDirection?: StyleWithScreenSizeModifier<FlexDirectionValues>
	gap?: StyleWithScreenSizeModifier<Gap>
	align?: StyleWithScreenSizeModifier<AlignValues>
	justify?: StyleWithScreenSizeModifier<JustifyValues>
	backgroundColor?: DarkColorNames | LightColorNames
	borderColor?: DarkColorNames | LightColorNames
	borderWidth?: StyleWithScreenSizeModifier<BorderWidth>
	borderRadius?: StyleWithScreenSizeModifier<BorderRadius>
	overflow?: StyleWithScreenSizeModifier<OverflowValues>
	opacity?: StyleWithScreenSizeModifier<Opacity>
	style?: StyleProp<unknown>
	colorScheme: ColorSchemeName
}): RegisteredStyle<unknown>[] {
	const stylesArray = []

	if (w) {
		let normalizedWidth = w
		if (_.isNumber(w) && _.isFinite(w)) normalizedWidth = pixelUnitHorizontal(w)
		stylesArray.push({ width: normalizedWidth })
	}

	if (minW) {
		let normalizedMinWidth = minW
		if (_.isNumber(minW) && _.isFinite(minW))
			normalizedMinWidth = pixelUnitHorizontal(minW)
		stylesArray.push({ minWidth: normalizedMinWidth })
	}

	if (h) {
		let normalizedHeight = h
		if (_.isNumber(h) && _.isFinite(h)) normalizedHeight = pixelUnitVertical(h)
		stylesArray.push({ height: normalizedHeight })
	}

	if (minH) {
		let normalizedMinHeight = minH
		if (_.isNumber(minH) && _.isFinite(minH))
			normalizedMinHeight = pixelUnitVertical(minH)
		stylesArray.push({ minHeight: normalizedMinHeight })
	}

	if (mt) {
		let normalizedMarginTop = mt
		if (_.isFinite(mt)) normalizedMarginTop = pixelUnitVertical(mt)
		stylesArray.push({ marginTop: normalizedMarginTop })
	}

	if (mb) {
		let normalizedMarginBottom = mb
		if (_.isFinite(mb)) normalizedMarginBottom = pixelUnitVertical(mb)
		stylesArray.push({ marginBottom: normalizedMarginBottom })
	}

	if (ml) {
		let normalizedMarginLeft = ml
		if (_.isFinite(ml)) normalizedMarginLeft = pixelUnitVertical(ml)
		stylesArray.push({ marginLeft: normalizedMarginLeft })
	}

	if (mr) {
		let normalizedMarginRight = mr
		if (_.isFinite(mr)) normalizedMarginRight = pixelUnitVertical(mr)
		stylesArray.push({ marginRight: normalizedMarginRight })
	}

	if (mv) {
		let normalizedMarginVertical = mv
		if (_.isFinite(mv)) normalizedMarginVertical = pixelUnitVertical(mv)
		stylesArray.push({ marginVertical: normalizedMarginVertical })
	}

	if (mh) {
		let normalizedMarginHorizontal = mh
		if (_.isFinite(mh)) normalizedMarginHorizontal = pixelUnitHorizontal(mh)
		stylesArray.push({ marginHorizontal: normalizedMarginHorizontal })
	}

	if (pt) {
		let normalizedPaddingTop = pt
		if (_.isFinite(pt)) normalizedPaddingTop = pixelUnitHorizontal(pt)
		stylesArray.push({ paddingTop: normalizedPaddingTop })
	}

	if (pb) {
		let normalizedPaddingBottom = pb
		if (_.isFinite(pb)) normalizedPaddingBottom = pixelUnitHorizontal(pb)
		stylesArray.push({ paddingBottom: normalizedPaddingBottom })
	}

	if (pl) {
		let normalizedPaddingLeft = pl
		if (_.isFinite(pl)) normalizedPaddingLeft = pixelUnitVertical(pl)
		stylesArray.push({ paddingLeft: normalizedPaddingLeft })
	}

	if (pr) {
		let normalizedPaddingRight = pr
		if (_.isFinite(pr)) normalizedPaddingRight = pixelUnitHorizontal(pr)
		stylesArray.push({ paddingRight: normalizedPaddingRight })
	}

	if (pv) {
		let normalizedPaddingVertical = pv
		if (_.isFinite(pv)) normalizedPaddingVertical = pixelUnitVertical(pv)
		stylesArray.push({ paddingVertical: normalizedPaddingVertical })
	}

	if (ph) {
		let normalizedPaddingHorizontal = ph
		if (_.isFinite(ph)) normalizedPaddingHorizontal = pixelUnitHorizontal(ph)
		stylesArray.push({ paddingHorizontal: normalizedPaddingHorizontal })
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

	if (gap) {
		let normalizedGap = gap
		if (_.isFinite(gap)) normalizedGap = pixelUnitHorizontal(gap)
		console.log('>>>>>>', {
			gap,
			normalizedGap
		})
		stylesArray.push({ gap: normalizedGap })
	}

	if (align && styles[`align-${align}`]) {
		stylesArray.push(styles[`align-${align}`])
	}

	if (justify && styles[`justify-${justify}`]) {
		stylesArray.push(styles[`justify-${justify}`])
	}

	colorScheme
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
