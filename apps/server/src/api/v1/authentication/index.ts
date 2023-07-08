import { Router } from 'express'

const router = Router()

/* ====================================================== */
/*                      Controllers                       */
/* ====================================================== */

import { signInWithGoogleController } from './sign_in_with_google'
import { getAuthenticatedUserController } from './get_authenticated_user'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const route = '/authentication'

router.post('/google', signInWithGoogleController)
router.get('/me', getAuthenticatedUserController)

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { router, route }
