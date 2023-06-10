import React from 'react'

import type { Align, Size, Weight } from './text_input_styles'
import type { ColorNames } from '@/ui/colors'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { TextInput as NativeTextInput, useColorScheme } from 'react-native'
import { Box } from '@/ui/box'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { styles } from './text_input_styles'
import type { BottomSheetTextInput } from '@gorhom/bottom-sheet'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type TextInputProps = {
	as?: typeof NativeTextInput | typeof BottomSheetTextInput
	size?: Size
	color?: ColorNames
	weight?: Weight
	align?: Align
}

const TextInput = React.forwardRef(
	(
		{
			as = NativeTextInput,
			size = 'body',
			color = 'text',
			weight = 'normal',
			align,
			...props
		}: React.ComponentProps<typeof NativeTextInput> &
			React.ComponentProps<typeof Box> &
			TextInputProps,
		ref
	) => {
		const scheme = useColorScheme() ?? 'light'

		const computedStyles = React.useMemo(() => {
			const stylesArray = []

			if (size) {
				stylesArray.push(styles[`size-${size}`])
			}

			if (color) {
				stylesArray.push(styles[`color-${scheme}-${color}`])
			}

			if (weight) {
				stylesArray.push(styles[`weight-${weight}`])
			}

			if (align) {
				stylesArray.push(styles[`align-${align}`])
			}

			return stylesArray
		}, [size, color, weight, align, scheme])

		return <Box ref={ref} as={as} {...props} style={computedStyles} />
	}
)

TextInput.displayName = 'TextInput'

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { TextInput }
