import { Router } from 'express'
import { signInWithGoogleController } from './sign_in_with_google'

const router = Router()

/* ====================================================== */
/*                      Controllers                       */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const route = '/authentication'

router.post('/google', signInWithGoogleController)

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { router, route }
