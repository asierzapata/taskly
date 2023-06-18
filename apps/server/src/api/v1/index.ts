import { Router } from 'express'

const router = Router()

/* ====================================================== */
/*                      Controllers                       */
/* ====================================================== */

import {
	router as authenticationRouter,
	route as authenticationRoute
} from './authentication'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const route = '/v1'

router.use(authenticationRoute, authenticationRouter)

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { router, route }
