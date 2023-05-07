import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useColorScheme, View } from 'react-native'
import { colors } from 'styleguide/colors'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { pixelSizeHorizontal, pixelSizeVertical } from 'styleguide/normalizer'
import { styles } from './box_styles'

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
}) => {
	const colorScheme = useColorScheme()

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

		if (relative) {
			stylesArray.push(styles.relative)
		}

		if (absolute) {
			stylesArray.push(styles.absolute)
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

Box.propTypes = {
	as: PropTypes.any,
	w: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	minW: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	h: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	minH: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	mt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	mb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	ml: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	mr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	mv: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	mh: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pv: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	ph: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	flex: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
	flexGrow: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
	flexShrink: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
	flexDirection: PropTypes.oneOf([
		'row',
		'column',
		'row-reverse',
		'column-reverse'
	]),
	align: PropTypes.oneOf([
		'center',
		'flex-start',
		'flex-end',
		'stretch',
		'baseline'
	]),
	justify: PropTypes.oneOf([
		'center',
		'flex-start',
		'flex-end',
		'space-between',
		'space-around',
		'space-evenly'
	]),
	relative: PropTypes.bool,
	absolute: PropTypes.bool,
	backgroundColor: PropTypes.oneOf([
		..._.keys(colors.dark),
		..._.keys(colors.light)
	]),
	borderColor: PropTypes.oneOf([
		..._.keys(colors.dark),
		..._.keys(colors.light)
	]),
	borderWidth: PropTypes.number,
	borderRadius: PropTypes.number,
	overflow: PropTypes.oneOf(['visible', 'hidden']),
	opacity: PropTypes.number,
	children: PropTypes.node,
	style: PropTypes.object
}

Box.defaultProps = {
	as: undefined,
	w: null,
	minW: null,
	h: null,
	minH: null,
	mt: null,
	mb: null,
	ml: null,
	mr: null,
	mv: null,
	mh: null,
	pt: null,
	pb: null,
	pl: null,
	pr: null,
	pv: null,
	ph: null,
	flex: null,
	flexGrow: null,
	flexShrink: null,
	flexDirection: null,
	align: null,
	justify: null,
	relative: null,
	absolute: null,
	backgroundColor: null,
	borderColor: null,
	borderWidth: null,
	borderRadius: null,
	overflow: null,
	opacity: null,
	children: null,
	style: null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Box }
