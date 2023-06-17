import type { Request, Response } from 'express'

import { Router } from 'express'

const router = Router()

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

router.get('/', (req: Request, res: Response) => {
	res.status(200).json({ message: 'I am healthyyyy!' })
})

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export default router
