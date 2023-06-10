import { supabase } from '@/supabase'
import PropTypes from 'prop-types'
import React from 'react'
import { Outlet } from 'react-router-dom'

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

const AuthenticationWrapper = ({}) => {
	const [session, setSession] = React.useState(null)

	React.useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	return (
		<div className="container" style={{ padding: '50px 0 100px 0' }}>
			{!session ? <></> : <Outlet />}
			{/* {!session ? <Auth /> : <Outlet />} */}
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AuthenticationWrapper }
