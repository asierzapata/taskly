import React from 'react'
import { ulid } from 'ulid'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { createSafe } from '../safe_management_slice'
import { useAppDispatch } from '@renderer/store/hooks'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, Input, Label } from '@taskly/web-ui'
import { type SubmitHandler, useForm } from 'react-hook-form'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

type CreateSafeProps = {
	onSafeCreated: (id: string) => Promise<void>
}

type CreateSafeForm = {
	name: string
	folder: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const CreateSafe = ({ onSafeCreated }: CreateSafeProps) => {
	const dispatch = useAppDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
		watch
	} = useForm<CreateSafeForm>()
	const onSubmit: SubmitHandler<CreateSafeForm> = async data => {
		const id = ulid()
		await dispatch(
			createSafe({
				id,
				name: data.name,
				path: data.folder
			})
		).unwrap()
		void onSafeCreated(id)
	}

	const handleSelectFolder = async () => {
		const { canceled, filePaths } = await window.filePicker.openDialog({
			properties: ['openDirectory']
		})
		if (canceled) {
			setError('folder', {
				type: 'manual',
				message: 'Picker closed'
			})
			return
		}
		if (filePaths.length === 0 || !filePaths[0]) {
			setError('folder', {
				type: 'manual',
				message: 'No folder selected'
			})
			return
		}
		setValue('folder', filePaths[0])
	}

	const folder = watch('folder')

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full">
			<div className="flex flex-col">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Name</Label>
					<Input {...register('name', { required: true })} />
					{errors.name?.message ? (
						<span className="text-red-500">{errors.name.message}</span>
					) : null}
				</div>
				<div className="mt-6 flex flex-col gap-2">
					<Label>Folder</Label>
					<div className="flex w-full items-center gap-4">
						{folder ? (
							<span className="text-muted-foreground line-clamp-2 flex-1 break-words">
								{folder}
							</span>
						) : (
							<span className="text-muted-foreground line-clamp-2 flex-1 break-words">
								No folder selected
							</span>
						)}
						<Input {...register('folder', { required: true })} type="hidden" />
						<Button
							variant="ghost"
							onClick={handleSelectFolder}
							className="flex-shrink-0"
						>
							Select Folder
						</Button>
					</div>

					{errors.folder?.message ? (
						<span className="text-destructive">{errors.folder.message}</span>
					) : null}
				</div>
				<Button type="submit" className="mt-12">
					Create
				</Button>
			</div>
		</form>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { CreateSafe }
