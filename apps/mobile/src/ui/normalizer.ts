import { Dimensions, PixelRatio } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Based on iPhone 12 viewport
const widthBaseScale = SCREEN_WIDTH / 390
const heightBaseScale = SCREEN_HEIGHT / 844

function normalize(size: number, based = 'width') {
	const newSize =
		based === 'height' ? size * heightBaseScale : size * widthBaseScale
	return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

const widthPixel = (size: number) => {
	return normalize(size, 'width')
}

const heightPixel = (size: number) => {
	return normalize(size, 'height')
}

const fontPixel = (size: number) => {
	return heightPixel(size)
}

const pixelSizeVertical = (size: number) => {
	return heightPixel(size)
}

const pixelSizeHorizontal = (size: number) => {
	return widthPixel(size)
}

const PIXELS_BY_UNIT = 4 // 4px

const pixelUnitHorizontal = (unit: number) => {
	return widthPixel(unit * PIXELS_BY_UNIT)
}

const pixelUnitVertical = (unit: number) => {
	return heightPixel(unit * PIXELS_BY_UNIT)
}

export {
	widthPixel,
	heightPixel,
	fontPixel,
	pixelSizeVertical,
	pixelSizeHorizontal,
	pixelUnitHorizontal,
	pixelUnitVertical
}
