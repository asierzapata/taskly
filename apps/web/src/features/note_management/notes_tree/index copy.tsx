import React, { useEffect } from 'react'
import _ from 'lodash'

import { type SubmitHandler, useForm } from 'react-hook-form'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

// import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
// import {
// 	rebuildTree,
// 	selectFolder,
// 	selectNote,
// 	startRenamingFolder,
// 	startRenamingNote,
// 	stopRenamingFolder,
// 	stopRenamingNote,
// 	toggleFolder
// } from '../note_management_slice'
import { type Folder, type Note } from '../types'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import {
	// Button,
	Icons,
	Input,
	Spinner,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	classnames
} from '@taskly/web-ui'
import { useFileSystem } from '@/lib/file_system'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type NotesTreeProps = {
	onNoteSelected: (note: FileSystemFileHandle) => void
}

type NotesTreeActionsProps = {
	onSearch: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NotesTree = ({ onNoteSelected }: NotesTreeProps) => {
	return (
		<div className="mt-4 overflow-y-auto">
			<NotesTreeRoot onNoteSelected={onNoteSelected} />
		</div>
	)
}

// export const NotesTreeActions = ({ onSearch }: NotesTreeActionsProps) => {
// 	const selectedPath = useAppSelector(state =>
// 		state.noteManagement.selectedPath.endsWith('.md')
// 			? state.noteManagement.selectedPath.split('/').slice(0, -1).join('/')
// 			: state.noteManagement.selectedPath
// 	)
// 	const dispatch = useAppDispatch()

// 	return (
// 		<div className="flex w-full items-center justify-center gap-2">
// 			<Button
// 				className="group flex items-center justify-center"
// 				variant="ghost"
// 				size="smallIcon"
// 				onClick={onSearch}
// 			>
// 				<Icons.search className="group-hover:stroke-accent-foreground h-4 w-4" />
// 			</Button>
// 			<Button
// 				variant="ghost"
// 				size="smallIcon"
// 				className="group flex items-center justify-center"
// 				onClick={() => {
// 					void window.api.noteFileSystem.CreateNote({
// 						path: selectedPath,
// 						name: 'New Note.md'
// 					})
// 				}}
// 			>
// 				<Icons.pencil className="group-hover:stroke-accent-foreground h-4 w-4" />
// 			</Button>
// 			<Button
// 				variant="ghost"
// 				size="smallIcon"
// 				className="group flex items-center justify-center"
// 				onClick={() => {
// 					void window.api.noteFileSystem.CreateFolder({
// 						path: selectedPath,
// 						name: 'New Folder'
// 					})
// 				}}
// 			>
// 				<Icons.addFolder className="group-hover:stroke-accent-foreground h-4 w-4" />
// 			</Button>
// 			<Button
// 				variant="ghost"
// 				size="smallIcon"
// 				className="group flex items-center justify-center"
// 				onClick={() => {
// 					void dispatch(rebuildTree())
// 				}}
// 				aria-label="Rebuild Tree"
// 			>
// 				<Icons.refresh className="group-hover:stroke-accent-foreground h-4 w-4" />
// 			</Button>
// 		</div>
// 	)
// }

const NotesTreeRoot = ({
	onNoteSelected
}: {
	onNoteSelected: (note: FileSystemFileHandle) => void
}) => {
	const { directoryHandle, getDirectoryEntries } = useFileSystem()

	const [isLoading, setIsLoading] = React.useState(true)
	const [directoryNodes, setDirectoryNodes] = React.useState<
		FileSystemHandle[]
	>([])

	useEffect(() => {
		const load = async () => {
			if (!directoryHandle) return
			const handles = await getDirectoryEntries(directoryHandle)
			setDirectoryNodes(handles)
			setIsLoading(false)
		}
		void load()
	}, [directoryHandle, getDirectoryEntries])

	if (isLoading) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<Spinner />
			</div>
		)
	}

	if (!directoryHandle)
		return (
			<div>
				<span className="text-red-500">Unexpected error</span>
			</div>
		)

	return (
		<div className="h-full w-full">
			{directoryNodes.map(handle => {
				if (handle.kind === 'directory') {
					return (
						<Folder
							key={`${directoryHandle.name}-${handle.name}`}
							parentHandle={directoryHandle}
							handle={handle as FileSystemDirectoryHandle}
							onNoteSelected={onNoteSelected}
						/>
					)
				}
				return (
					<Note
						key={`${directoryHandle.name}-${handle.name}`}
						parentHandle={directoryHandle}
						handle={handle as FileSystemFileHandle}
						onNoteSelected={onNoteSelected}
					/>
				)
			})}
		</div>
	)
}

const Folder = ({
	parentHandle,
	handle,
	onNoteSelected
}: {
	parentHandle: FileSystemDirectoryHandle
	handle: FileSystemDirectoryHandle
	onNoteSelected: (note: FileSystemFileHandle) => void
}) => {
	const { getDirectoryEntries } = useFileSystem()

	const [isOpen, setIsOpen] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(true)
	const [isRenaming, setIsRenaming] = React.useState(false)
	const [directoryNodes, setDirectoryNodes] = React.useState<
		FileSystemHandle[]
	>([])

	const folderRef = React.useRef<HTMLButtonElement>(null)

	const onToggleFolder = () => {
		setIsOpen(_isOpen => !_isOpen)
	}

	const handleFinishedRenaming = () => {
		setIsRenaming(false)
	}

	useEffect(() => {
		const load = async () => {
			const handles = await getDirectoryEntries(handle)
			setDirectoryNodes(handles)
			setIsLoading(false)
		}
		void load()
	}, [getDirectoryEntries, handle])

	if (isLoading) {
		return (
			<div>
				<Spinner />
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			{!isRenaming ? (
				<button
					ref={folderRef}
					onClick={onToggleFolder}
					className={classnames(
						'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent'
					)}
				>
					{isOpen ? (
						<Icons.chevronDown
							size={16}
							className="min-h-[16px] min-w-[16px]"
						/>
					) : (
						<Icons.chevronRight
							size={16}
							className="min-h-[16px] min-w-[16px]"
						/>
					)}
					{isOpen ? (
						<Icons.folderOpen
							size={16}
							className="ml-1 min-h-[16px] min-w-[16px]"
						/>
					) : (
						<Icons.folder
							size={16}
							className="ml-1 min-h-[16px] min-w-[16px]"
						/>
					)}
					<span className="ml-2 truncate text-start">{handle.name}</span>
				</button>
			) : (
				<div
					className={classnames(
						'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent'
					)}
				>
					{isOpen ? (
						<Icons.chevronDown
							size={16}
							className="min-h-[16px] min-w-[16px]"
						/>
					) : (
						<Icons.chevronRight
							size={16}
							className="min-h-[16px] min-w-[16px]"
						/>
					)}
					{isOpen ? (
						<Icons.folderOpen
							size={16}
							className="ml-1 min-h-[16px] min-w-[16px]"
						/>
					) : (
						<Icons.folder
							size={16}
							className="ml-1 min-h-[16px] min-w-[16px]"
						/>
					)}
					<div className="p-1">
						<FolderRenameInput
							parentHandle={parentHandle}
							handle={handle}
							onFinishedRenaming={handleFinishedRenaming}
						/>
					</div>
				</div>
			)}
			{isOpen ? (
				<div className={'ml-4'}>
					{directoryNodes.map(_handle => {
						if (_handle.kind === 'directory') {
							return (
								<Folder
									key={`${handle.name}-${_handle.name}`}
									parentHandle={handle}
									handle={_handle as FileSystemDirectoryHandle}
									onNoteSelected={onNoteSelected}
								/>
							)
						}
						return (
							<Note
								key={`${handle.name}-${_handle.name}`}
								parentHandle={handle}
								handle={_handle as FileSystemFileHandle}
								onNoteSelected={onNoteSelected}
							/>
						)
					})}
				</div>
			) : null}
		</div>
	)
}

type FolderRenameInputForm = {
	name: string
}

const FolderRenameInput = ({
	parentHandle,
	handle,
	onFinishedRenaming
}: {
	parentHandle: FileSystemDirectoryHandle
	handle: FileSystemDirectoryHandle
	onFinishedRenaming: () => void
}) => {
	const { getDirectoryEntries, renameFolder } = useFileSystem()

	const [folderNamesOnSamePath, setFolderNamesOnSamePath] = React.useState<
		string[]
	>([])

	useEffect(() => {
		const load = async () => {
			const handles = await getDirectoryEntries(parentHandle)
			const folderNames = handles
				.filter(h => h.kind === 'directory')
				.map(h => h.name)
			setFolderNamesOnSamePath(folderNames)
		}
		void load()
	}, [getDirectoryEntries, parentHandle])

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FolderRenameInputForm>({
		defaultValues: {
			name: handle.name
		}
	})
	const onSubmit: SubmitHandler<FolderRenameInputForm> = data => {
		console.log('>>>>>> onSubmit', data)
		void renameFolder(parentHandle, handle, data.name)
	}

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Escape' && _.isEmpty(errors.name)) {
				return onFinishedRenaming()
			}
		},
		[errors.name, onFinishedRenaming]
	)

	return (
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		<form onSubmit={handleSubmit(onSubmit)}>
			<TooltipProvider>
				<Tooltip open={!_.isEmpty(errors.name)}>
					<TooltipTrigger asChild>
						<Input
							{...register('name', {
								required: true,
								// The patter should support letters, numbers, dashes, underscores and spaces
								pattern: /^[\w\-_\s]+$/,
								validate: {
									isUnique: value => !folderNamesOnSamePath.includes(value)
								}
							})}
							dimension="sm"
							isInvalid={!_.isEmpty(errors.name)}
							autoFocus
							onKeyDown={handleKeyDown}
						/>
					</TooltipTrigger>
					{errors.name?.type === 'required' && (
						<TooltipContent variant="danger">Name is required</TooltipContent>
					)}
					{errors.name?.type === 'pattern' && (
						<TooltipContent variant="danger">
							Name can only contain letters, numbers, dashes, underscores and
							spaces
						</TooltipContent>
					)}
					{errors.name?.type === 'isUnique' && (
						<TooltipContent variant="danger">
							Name must be unique
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</form>
	)
}

const Note = ({
	parentHandle,
	handle,
	onNoteSelected
}: {
	parentHandle: FileSystemDirectoryHandle
	handle: FileSystemFileHandle
	onNoteSelected: (note: FileSystemFileHandle) => void
}) => {
	const handleNoteSelected = React.useCallback(() => {
		onNoteSelected(handle)
	}, [handle, onNoteSelected])

	const noteName = handle.name.split('.').slice(0, -1).join('.')
	const noteExtension = handle.name.split('.').slice(-1).join('.')

	return (
		<button
			className={classnames(
				'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-between rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent'
			)}
			onClick={handleNoteSelected}
		>
			<Icons.page size={16} className="ml-5 min-h-[16px] min-w-[16px]" />
			<div className="ml-4 flex-1 truncate text-start">{noteName}</div>
			<div className="bg-muted text-muted-foreground ml-1 rounded p-0.5 text-xs text-gray-400">
				{noteExtension}
			</div>
		</button>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NotesTree }
