import React from 'react'

/* ====================================================== */
/*                         Styles                        */
/* ====================================================== */

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

export const MainScreen = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-slate-700 text-2xl text-slate-200">
			<h1 className="block text-4xl font-semibold text-gray-800 dark:text-gray-200 md:text-5xl lg:text-6xl">
				<span className="bg-gradient-to-tl from-cyan-400 to-purple-400 bg-clip-text text-transparent">
					Taskly
				</span>
			</h1>
		</div>
	)
}
