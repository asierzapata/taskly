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
import {
	type FileSystemFile,
	type FileSystemTreeNode
} from '@/lib/file_system/types'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type NotesTreeProps = {
	onNoteSelected: (noteId: string) => void
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
	onNoteSelected: (noteId: string) => void
}) => {
	const { getFileSystemTree } = useFileSystem()

	const [isLoading, setIsLoading] = React.useState(true)
	const [fileSystemTree, setFileSystemTree] =
		React.useState<FileSystemTreeNode | null>(null)

	useEffect(() => {
		const load = async () => {
			const tree = await getFileSystemTree()
			if (!tree) {
				// TODO: Handle error
				return
			}
			setFileSystemTree(tree)
			setIsLoading(false)
		}
		void load()
	}, [getFileSystemTree])

	if (isLoading) {
		return (
			<div>
				<Spinner />
			</div>
		)
	}

	return (
		<div className="h-full w-full">
			{fileSystemTree?.folders.map(folder => (
				<Folder
					key={`${folder.parentHandle?.name ?? 'root'}-${folder.name}`}
					node={folder}
					onNoteSelected={onNoteSelected}
				/>
			))}
			{fileSystemTree?.files.map(file => {
				return (
					<Note
						key={`${file.parentHandle?.name ?? 'root'}-${file.name}`}
						node={file}
						onNoteSelected={onNoteSelected}
					/>
				)
			})}
		</div>
	)
}

const Folder = ({
	node,
	onNoteSelected
}: {
	node: FileSystemTreeNode
	onNoteSelected: (noteId: string) => void
}) => {
	const [isOpen, setIsOpen] = React.useState(false)
	const [isRenaming, setIsRenaming] = React.useState(false)

	const folderRef = React.useRef<HTMLButtonElement>(null)

	const onToggleFolder = () => {
		setIsOpen(_isOpen => !_isOpen)
	}

	const handleFinishedRenaming = () => {
		setIsRenaming(false)
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
					<span className="ml-2 truncate text-start">{node.name}</span>
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
							node={node}
							onFinishedRenaming={handleFinishedRenaming}
						/>
					</div>
				</div>
			)}
			{isOpen ? (
				<div className={'ml-4'}>
					{node.folders.map(folder => {
						return (
							<Folder
								key={`${node.name}-${folder.name}`}
								node={folder}
								onNoteSelected={onNoteSelected}
							/>
						)
					})}
					{node.files.map(file => {
						return (
							<Note
								key={`${node.name}-${file.name}`}
								node={file}
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
	node,
	onFinishedRenaming
}: {
	node: FileSystemTreeNode
	onFinishedRenaming: () => void
}) => {
	const { getDirectoryEntries, renameFolder } = useFileSystem()

	const [folderNamesOnSamePath, setFolderNamesOnSamePath] = React.useState<
		string[]
	>([])

	useEffect(() => {
		const load = async () => {
			const handles = await getDirectoryEntries(node.parentHandle)
			const folderNames = handles
				.filter(h => h.kind === 'directory')
				.map(h => h.name)
			setFolderNamesOnSamePath(folderNames)
		}
		void load()
	}, [getDirectoryEntries, node.parentHandle])

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FolderRenameInputForm>({
		defaultValues: {
			name: node.name
		}
	})
	const onSubmit: SubmitHandler<FolderRenameInputForm> = data => {
		console.log('>>>>>> onSubmit', data)
		void renameFolder(node.parentHandle, node.handle, data.name)
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
	node,
	onNoteSelected
}: {
	node: FileSystemFile
	onNoteSelected: (noteId: string) => void
}) => {
	const handleNoteSelected = React.useCallback(() => {
		onNoteSelected(node.id)
	}, [node.id, onNoteSelected])

	const noteName = node.name.split('.').slice(0, -1).join('.')
	const noteExtension = node.name.split('.').slice(-1).join('.')

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
