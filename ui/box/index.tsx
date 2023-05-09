import * as React from 'react'
import * as _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import type { StyleProp } from 'react-native'
import { useColorScheme, View } from 'react-native'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { pixelSizeHorizontal, pixelSizeVertical } from '@/ui/normalizer'
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

const Box = ({
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
	align,
	justify,
	relative,
	absolute,
	backgroundColor,
	borderColor,
	borderWidth,
	borderRadius,
	overflow,
	opacity,
	children,
	style,
	...props
}: {
	as?: string | React.ComponentType<any>
	w?: number
	minW?: number
	h?: number
	minH?: number
	mt?: number
	mb?: number
	ml?: number
	mr?: number
	mv?: number
	mh?: number
	pt?: number
	pb?: number
	pl?: number
	pr?: number
	pv?: number
	ph?: number
	flex?: FlexValues
	flexGrow?: FlexValues
	flexShrink?: FlexValues
	flexDirection?: FlexDirectionValues
	align?: AlignValues
	justify?: JustifyValues
	relative?: boolean
	absolute?: boolean
	backgroundColor?: DarkColorNames | LightColorNames
	borderColor?: DarkColorNames | LightColorNames
	borderWidth?: number
	borderRadius?: number
	overflow?: OverflowValues
	opacity?: number
	children?: React.ReactNode
	style?: StyleProp<unknown>
	// This is a hack to allow any other props to be passed to the component `as`
	[key: string]: unknown
}) => {
	const colorScheme = useColorScheme() || 'light'

	const computedStyles = React.useMemo(() => {
		const stylesArray = []

		if (w) {
			let normalizedWidth = w
			if (_.isFinite(w)) normalizedWidth = pixelSizeHorizontal(w)
			stylesArray.push({ width: normalizedWidth })
		}

		if (minW) {
			let normalizedMinWidth = minW
			if (_.isFinite(minW)) normalizedMinWidth = pixelSizeHorizontal(minW)
			stylesArray.push({ minWidth: normalizedMinWidth })
		}

		if (h) {
			let normalizedHeight = h
			if (_.isFinite(h)) normalizedHeight = pixelSizeVertical(h)
			stylesArray.push({ height: normalizedHeight })
		}

		if (minH) {
			let normalizedMinHeight = minH
			if (_.isFinite(minH)) normalizedMinHeight = pixelSizeVertical(minH)
			stylesArray.push({ minHeight: normalizedMinHeight })
		}

		if (mt) {
			let normalizedMarginTop = mt
			if (_.isFinite(mt)) normalizedMarginTop = pixelSizeVertical(mt)
			stylesArray.push({ marginTop: normalizedMarginTop })
		}

		if (mb) {
			let normalizedMarginBottom = mb
			if (_.isFinite(mb)) normalizedMarginBottom = pixelSizeVertical(mb)
			stylesArray.push({ marginBottom: normalizedMarginBottom })
		}

		if (ml) {
			let normalizedMarginLeft = ml
			if (_.isFinite(ml)) normalizedMarginLeft = pixelSizeVertical(ml)
			stylesArray.push({ marginLeft: normalizedMarginLeft })
		}

		if (mr) {
			let normalizedMarginRight = mr
			if (_.isFinite(mr)) normalizedMarginRight = pixelSizeVertical(mr)
			stylesArray.push({ marginRight: normalizedMarginRight })
		}

		if (mv) {
			let normalizedMarginVertical = mv
			if (_.isFinite(mv)) normalizedMarginVertical = pixelSizeVertical(mv)
			stylesArray.push({ marginVertical: normalizedMarginVertical })
		}

		if (mh) {
			let normalizedMarginHorizontal = mh
			if (_.isFinite(mh)) normalizedMarginHorizontal = pixelSizeHorizontal(mh)
			stylesArray.push({ marginHorizontal: normalizedMarginHorizontal })
		}

		if (pt) {
			let normalizedPaddingTop = pt
			if (_.isFinite(pt)) normalizedPaddingTop = pixelSizeHorizontal(pt)
			stylesArray.push({ paddingTop: normalizedPaddingTop })
		}

		if (pb) {
			let normalizedPaddingBottom = pb
			if (_.isFinite(pb)) normalizedPaddingBottom = pixelSizeHorizontal(pb)
			stylesArray.push({ paddingBottom: normalizedPaddingBottom })
		}

		if (pl) {
			let normalizedPaddingLeft = pl
			if (_.isFinite(pl)) normalizedPaddingLeft = pixelSizeVertical(pl)
			stylesArray.push({ paddingLeft: normalizedPaddingLeft })
		}

		if (pr) {
			let normalizedPaddingRight = pr
			if (_.isFinite(pr)) normalizedPaddingRight = pixelSizeHorizontal(pr)
			stylesArray.push({ paddingRight: normalizedPaddingRight })
		}

		if (pv) {
			let normalizedPaddingVertical = pv
			if (_.isFinite(pv)) normalizedPaddingVertical = pixelSizeVertical(pv)
			stylesArray.push({ paddingVertical: normalizedPaddingVertical })
		}

		if (ph) {
			let normalizedPaddingHorizontal = ph
			if (_.isFinite(ph)) normalizedPaddingHorizontal = pixelSizeHorizontal(ph)
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
		relative,
		absolute,
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
		<Component style={computedStyles} {...props}>
			{children}
		</Component>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Box }
