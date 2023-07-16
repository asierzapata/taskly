import React from 'react'
import PropTypes from 'prop-types'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafeWelcome = () => {
	return (
		<div className="m-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6">
			<div className="text-3xl font-bold">
				Welcome to{' '}
				<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
					Taskly
				</span>
				!
			</div>
			<div className="text-xl">
				You can use Taskly to organize your tasks and notes.
			</div>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafeWelcome }
