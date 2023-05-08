import React from 'react'
import PropTypes from 'prop-types'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { FontAwesome5 } from '@expo/vector-icons'
import { Box } from '@/ui/box'
import { pixelSizeVertical } from '@/ui/normalizer'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Icon = ({
	name,
	color,
	size
}: {
	name: keyof typeof FontAwesome5.glyphMap
	color: string
	size: number
}) => {
	const normalizedSize = pixelSizeVertical(size)
	return (
		<Box as={FontAwesome5} name={name} size={normalizedSize} color={color} />
	)
}

Icon.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	size: PropTypes.number.isRequired
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Icon }
