import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@renderer/store/hooks'
import { useNavigate } from 'react-router-dom'
import { selectSafe } from '@renderer/features/safe_management/safe_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, H1, Icons } from '@taskly/web-ui'
import { Screen } from '@renderer/ui/screen'
import { CreateSafe } from '@renderer/features/safe_management/create_safe'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafeCreation = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const handleSafeCreated = async (id: string) => {
		await dispatch(selectSafe({ id })).unwrap()
		navigate(`/safe/${id}`)
	}

	const handleGoBack = () => {
		navigate('/')
	}

	return (
		<Screen>
			<div className="min-h-screen-without-frame m-auto flex h-full max-w-xl flex-col items-center justify-start">
				<div className="relative flex w-full  flex-row items-center justify-start gap-2 p-4">
					<Button variant="ghost" size="sm" onClick={handleGoBack}>
						<Icons.arrowLeft size={20} />
					</Button>
					<H1>Create Safe</H1>
				</div>
				<div className="flex w-full flex-1 flex-col items-center justify-center px-16">
					<CreateSafe onSafeCreated={handleSafeCreated} />
				</div>
			</div>
		</Screen>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafeCreation }
