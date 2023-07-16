import React from 'react'
import { useNavigate } from 'react-router-dom'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@renderer/store/hooks'
import { selectSafe } from '@renderer/features/safe_management/safe_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Screen } from '@renderer/ui/screen'
import { Button, H1, Icons } from '@taskly/web-ui'
import { SafesList } from '@renderer/features/safe_management/safes_list'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafeSelection = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const handleSelectSafe = async (id: string) => {
		await dispatch(selectSafe({ id })).unwrap()
		navigate(`/safe/${id}`)
	}

	const handleAddSafe = () => {
		navigate('/create_safe')
	}

	return (
		<Screen>
			<div className="min-h-screen-without-frame m-auto flex h-full max-w-xl flex-col items-center justify-start">
				<div className="flex w-full max-w-xl flex-row items-center justify-between p-4 pl-10">
					<H1>Safes</H1>
					<div>
						<Button variant="ghost" size="sm" onClick={handleAddSafe}>
							<Icons.add size={20} />
						</Button>
					</div>
				</div>
				<div className="flex w-full flex-1 flex-col items-start justify-start pl-10 pr-4">
					<SafesList onSelectSafe={handleSelectSafe} />
				</div>
			</div>
		</Screen>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafeSelection }
