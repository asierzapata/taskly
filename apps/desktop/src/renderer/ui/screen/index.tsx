import React from 'react'
import PropTypes from 'prop-types'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useCurrentSafe } from '@renderer/features/safe_management/use_current_safe'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

type ScreenProps = {
	children: React.ReactNode
}

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import './screen.css'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const Screen = ({ children }: ScreenProps) => {
	const currentSafe = useCurrentSafe()

	console.log('>>>>>>', 'Screen', currentSafe)

	return (
		<>
			<div className="titlebar">
				{currentSafe?.name ? (
					<div className="titlebar-text">Taskly - {currentSafe.name}</div>
				) : (
					<div className="titlebar-text">Taskly</div>
				)}
			</div>
			{children}
		</>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { Screen }
