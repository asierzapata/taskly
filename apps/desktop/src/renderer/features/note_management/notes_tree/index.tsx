import React from 'react'
import _ from 'lodash'

import { type SubmitHandler, useForm } from 'react-hook-form'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
	rebuildTree,
	selectFolder,
	selectNote,
	startRenamingFolder,
	startRenamingNote,
	stopRenamingFolder,
	stopRenamingNote,
	toggleFolder
} from '../note_management_slice'
import { Folder, Note } from '../types'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useContextMenu } from '@renderer/lib/context_menu'
import {
	Button,
	Icons,
	Input,
	Spinner,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	classnames
} from '@taskly/web-ui'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type NotesTreeProps = {
	onNoteSelected: (note: Note) => void
}

type NotesTreeActionsProps = {
	onSearch: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NotesTree = ({ onNoteSelected }: NotesTreeProps) => {
	const isRebuildingTree = useAppSelector(
		state => state.noteManagement.isRebuilding
	)
	const isTreeEmpty = useAppSelector(state =>
		_.isEmpty(state.noteManagement.tree)
	)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		if (isTreeEmpty) {
			void dispatch(rebuildTree())
		}
	}, [dispatch, isTreeEmpty])

	if (isRebuildingTree) {
		return (
			<div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
				<span>Building Tree...</span>
				<Spinner />
			</div>
		)
	}

	return (
		<div className="mt-4 overflow-y-auto">
			<NotesTreeRoot onNoteSelected={onNoteSelected} />
		</div>
	)
}

export const NotesTreeActions = ({ onSearch }: NotesTreeActionsProps) => {
	const selectedPath = useAppSelector(state =>
		state.noteManagement.selectedPath.endsWith('.md')
			? state.noteManagement.selectedPath.split('/').slice(0, -1).join('/')
			: state.noteManagement.selectedPath
	)
	const dispatch = useAppDispatch()

	return (
		<div className="flex w-full items-center justify-center gap-2">
			<Button
				className="group flex items-center justify-center"
				variant="ghost"
				size="smallIcon"
				onClick={onSearch}
			>
				<Icons.search className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="smallIcon"
				className="group flex items-center justify-center"
				onClick={() => {
					void window.api.noteFileSystem.CreateNote({
						path: selectedPath,
						name: 'New Note.md'
					})
				}}
			>
				<Icons.pencil className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="smallIcon"
				className="group flex items-center justify-center"
				onClick={() => {
					void window.api.noteFileSystem.CreateFolder({
						path: selectedPath,
						name: 'New Folder'
					})
				}}
			>
				<Icons.addFolder className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="smallIcon"
				className="group flex items-center justify-center"
				onClick={() => {
					void dispatch(rebuildTree())
				}}
				aria-label="Rebuild Tree"
			>
				<Icons.refresh className="group-hover:stroke-accent-foreground h-4 w-4" />
			</Button>
		</div>
	)
}

const NotesTreeRoot = ({
	onNoteSelected
}: {
	onNoteSelected: (note: Note) => void
}) => {
	const treeNode = useAppSelector(state => state.noteManagement.tree['/'])

	return (
		<div className="h-full w-full">
			{treeNode?.folders.map(folder => (
				<Folder
					key={folder.id}
					id={folder.id}
					onNoteSelected={onNoteSelected}
				/>
			))}
			{treeNode?.notes.map(note => (
				<Note key={note.id} id={note.id} onNoteSelected={onNoteSelected} />
			))}
		</div>
	)
}

const Folder = ({
	id,
	onNoteSelected
}: {
	id: string
	onNoteSelected: (note: Note) => void
}) => {
	const folder = useAppSelector(state => state.noteManagement.folders[id])
	const folderFullPath = folder?.path.endsWith('/')
		? `${folder.path}${folder.name}`
		: `${folder?.path}/${folder?.name}`

	const isFolderSelected = useAppSelector(
		state => state.noteManagement.selectedPath === folderFullPath
	)

	const treeNode = useAppSelector(state =>
		folder
			? state.noteManagement.tree[folderFullPath]
			: {
					folders: [],
					notes: []
			  }
	)
	const isOpen = folder?.isOpen
	const dispatch = useAppDispatch()

	const folderRef = React.useRef<HTMLButtonElement>(null)

	const onContextMenu = () => {
		if (!folder) return
		dispatch(selectFolder({ folderId: folder.id }))
		window.contextMenu.createContextMenu([
			{
				label: 'New Note',
				click: () => {
					void window.api.noteFileSystem.CreateNote({
						path: folderFullPath,
						name: 'New Note.md'
					})
				}
			},
			{
				label: 'New Folder',
				click: () => {
					void window.api.noteFileSystem.CreateFolder({
						path: folderFullPath,
						name: 'New Folder'
					})
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Rename',
				click: () => {
					dispatch(startRenamingFolder({ id: folder.id }))
				}
			},
			{
				label: 'Delete',
				click: () => {
					void window.api.noteFileSystem.DeleteFolder({
						path: folder.path,
						name: folder.name
					})
				}
			}
		])
	}

	useContextMenu({ ref: folderRef, onContextMenu })

	const onToggleFolder = () => {
		dispatch(toggleFolder({ id }))
		dispatch(selectFolder({ folderId: id }))
	}

	if (!folder) return null

	return (
		<div className="flex flex-col">
			{!folder.isRenaming ? (
				<button
					ref={folderRef}
					onClick={onToggleFolder}
					className={classnames(
						'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent',
						isFolderSelected ? 'bg-accent text-accent-foreground' : ''
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
					<span className="ml-2 truncate text-start">{folder.name}</span>
				</button>
			) : (
				<div
					className={classnames(
						'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent',
						isFolderSelected ? 'bg-accent text-accent-foreground' : ''
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
						<FolderRenameInput id={id} />
					</div>
				</div>
			)}
			{isOpen ? (
				<div className={'ml-4'}>
					{treeNode?.folders.map(folder => {
						return (
							<Folder
								key={folder.id}
								id={folder.id}
								onNoteSelected={onNoteSelected}
							/>
						)
					})}
					{treeNode?.notes.map(note => (
						<Note key={note.id} id={note.id} onNoteSelected={onNoteSelected} />
					))}
				</div>
			) : null}
		</div>
	)
}

type FolderRenameInputForm = {
	name: string
}

const FolderRenameInput = ({ id }: { id: string }) => {
	const dispatch = useAppDispatch()
	const folder = useAppSelector(state => state.noteManagement.folders[id])
	const folderNamesOnSamePath = useAppSelector(state => {
		if (!folder) return []
		const foldersWithoutCurrentFolder = state.noteManagement.tree[
			folder.path
		]?.folders.filter(n => n.id !== folder.id)
		return (
			foldersWithoutCurrentFolder?.map(n => {
				return state.noteManagement.folders[n.id]?.name.split('.')[0]
			}) ?? []
		)
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FolderRenameInputForm>({
		defaultValues: {
			name: folder?.name.split('.')[0] ?? ''
		}
	})
	const onSubmit: SubmitHandler<FolderRenameInputForm> = data => {
		console.log('>>>>>> onSubmit', data)
		if (!folder) return
		void window.api.noteFileSystem.RenameFolder({
			path: folder.path,
			oldName: folder.name,
			newName: _.trim(data.name)
		})
	}

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Escape' && _.isEmpty(errors.name)) {
				dispatch(stopRenamingFolder({ id }))
				return
			}
		},
		[dispatch, errors.name, id]
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
	id,
	onNoteSelected
}: {
	id: string
	onNoteSelected: (note: Note) => void
}) => {
	const note = useAppSelector(state => state.noteManagement.notes[id])
	const noteRef = React.useRef<HTMLButtonElement>(null)
	const dispatch = useAppDispatch()

	const noteFullPath = note?.path.endsWith('/')
		? `${note.path}${note.name}`
		: `${note?.path}/${note?.name}`

	const isNoteSelected = useAppSelector(
		state => state.noteManagement.selectedPath === noteFullPath
	)

	const onContextMenu = () => {
		window.contextMenu.createContextMenu([
			// {
			// 	label: 'Rename',
			// 	click: () => {
			// 		dispatch(startRenamingNote({ id }))
			// 	}
			// },
			{
				label: 'Delete',
				accelerator: 'CommandOrControl+Backspace',
				click: () => {
					if (!note) return
					void window.api.noteFileSystem.DeleteNote({
						path: note.path,
						name: note.name
					})
				}
			}
		])
	}

	useContextMenu({ ref: noteRef, onContextMenu })

	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (e.key === 'Enter') {
			dispatch(startRenamingNote({ id }))
			e.stopPropagation()
		}
	}

	const handleNoteSelected = React.useCallback(() => {
		if (!note) return
		onNoteSelected(note)
		dispatch(selectNote({ noteId: id }))
	}, [dispatch, id, note, onNoteSelected])

	if (!note) return null

	const noteName = note.name.split('.')[0]

	return (
		<button
			ref={noteRef}
			className={classnames(
				'hover:bg-accent focus:ring-accent data-[state=open]:bg-accent dark:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus:ring-accent flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none  disabled:opacity-50 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent',
				isNoteSelected ? 'bg-muted text-muted-foreground' : ''
			)}
			onKeyDown={handleKeyDown}
			onClick={handleNoteSelected}
		>
			<Icons.page size={16} className="ml-5 min-h-[16px] min-w-[16px]" />
			{/* {!note.isRenaming ? ( */}
			<div className="ml-4 truncate text-start">{noteName}</div>
			{/* ) : ( */}
			{/* <NoteRenameInput id={id} /> */}
			{/* )} */}
		</button>
	)
}

type NoteRenameInputForm = {
	name: string
}

const NoteRenameInput = ({ id }: { id: string }) => {
	const dispatch = useAppDispatch()
	const note = useAppSelector(state => state.noteManagement.notes[id])
	const noteNamesOnSamePath = useAppSelector(state => {
		if (!note) return []
		const notesWithoutCurrentNote = state.noteManagement.tree[
			note.path
		]?.notes.filter(n => n.id !== note.id)
		return (
			notesWithoutCurrentNote?.map(n => {
				return state.noteManagement.notes[n.id]?.name.split('.')[0]
			}) ?? []
		)
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<NoteRenameInputForm>({
		defaultValues: {
			name: note?.name.split('.')[0] ?? ''
		}
	})
	const onSubmit: SubmitHandler<NoteRenameInputForm> = data => {
		if (!note) return
		void window.api.noteFileSystem.RenameNote({
			path: note.path,
			oldName: note.name,
			newName: `${data.name}.md`
		})
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape' && _.isEmpty(errors.name)) {
			dispatch(stopRenamingNote({ id }))
		}
	}

	return (
		<form onSubmit={void handleSubmit(onSubmit)}>
			<TooltipProvider>
				<Tooltip open={!_.isEmpty(errors.name)}>
					<TooltipTrigger>
						<Input
							{...register('name', {
								required: true,
								// The patter should support letters, numbers, dashes, underscores and spaces
								pattern: /^[\w\-_\s]+$/,
								validate: {
									isUnique: value => !noteNamesOnSamePath.includes(value)
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

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NotesTree }
