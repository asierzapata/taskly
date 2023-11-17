import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useSafeManagementStore } from '../safe_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, Icons } from '@taskly/web-ui'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type SafeListProps = {
	onSelectSafe: ({ id, path }: { id: string; path: string }) => Promise<void>
}

type SafeItemProps = {
	id: string
	onSelectSafe: ({ id, path }: { id: string; path: string }) => Promise<void>
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const SafesList = ({ onSelectSafe }: SafeListProps) => {
	const safes = useSafeManagementStore.use.safes()
	return (
		<div className="flex w-full flex-col gap-2">
			{Object.keys(safes).map(id => (
				<SafeItem key={id} id={id} onSelectSafe={onSelectSafe} />
			))}
		</div>
	)
}

const SafeItem = ({ id, onSelectSafe }: SafeItemProps) => {
	const safe = useSafeManagementStore.use.safes()[id]
	const removeSafe = useSafeManagementStore.use.removeSafe()

	const onDeleteSafe = () => {
		removeSafe({ id })
	}

	if (!safe) {
		return null
	}

	const handleSelectSafe = () => {
		const handler = async () => {
			await onSelectSafe({
				id,
				path: safe.path
			})
		}
		void handler()
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
