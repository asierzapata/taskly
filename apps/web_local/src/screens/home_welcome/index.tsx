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

const HomeWelcome = () => {
	return (
		<div className="m-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-6">
			<div className="text-center text-3xl font-bold">
				Welcome to{' '}
				<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-transparent">
					Taskly
				</span>
				!
			</div>
			<div className="text-center text-xl">
				You can use Taskly to organize notes.
			</div>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { HomeWelcome }
