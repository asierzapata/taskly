import React from 'react'

/* ====================================================== */
/*                         Styles                        */
/* ====================================================== */

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { type NextPage } from 'next'
import Head from 'next/head'

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Taskly</title>
			</Head>
			<div className="flex min-h-screen items-center justify-center ">
				<div className="flex min-h-screen items-center justify-center">
					<span className="bg-gradient-to-tl from-amber-400 to-orange-600 bg-clip-text text-5xl font-bold text-transparent">
						Taskly
					</span>
				</div>
			</div>
		</>
	)
}

export default Home
