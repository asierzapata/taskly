import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, Icons } from '@taskly/web-ui'
import { removeSafe } from '../safe_management_slice'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type SafeListProps = {
	onSelectSafe: (id: string) => void
}

type SafeItemProps = {
	id: string
	onSelectSafe: (id: string) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafesList = ({ onSelectSafe }: SafeListProps) => {
	const safes = useAppSelector(state => state.safeManagement.safes)
	return (
		<div className="flex w-full flex-col gap-2">
			{Object.keys(safes).map(id => (
				<SafeItem key={id} id={id} onSelectSafe={onSelectSafe} />
			))}
		</div>
	)
}

const SafeItem = ({ id, onSelectSafe }: SafeItemProps) => {
	const safe = useAppSelector(state => state.safeManagement.safes[id])
	const dispatch = useAppDispatch()

	const onDeleteSafe = () => {
		dispatch(removeSafe({ id }))
	}

	const handleSelectSafe = () => {
		onSelectSafe(id)
	}

	if (!safe) {
		return null
	}

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<Button
				size="sm"
				variant="ghost"
				className="flex w-full items-center justify-start gap-2"
				onClick={handleSelectSafe}
			>
				<Icons.safe size={18} />
				<span>{safe.name}</span>
			</Button>
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" onClick={onDeleteSafe}>
					<Icons.trash size={18} />
				</Button>
				{/* <Icons.pencil size={16} /> */}
			</div>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SafesList }
