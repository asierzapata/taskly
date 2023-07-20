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
	startRenamingFolder,
	startRenamingNote,
	stopRenamingNote,
	toggleFolder
} from '../note_management_slice'
import { Folder, Note } from '../types'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useContextMenu } from '@renderer/lib/context_menu'
import {
	Icons,
	Input,
	Spinner,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@taskly/web-ui'

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

type NotesTreeProps = {
	onNoteSelected: (note: Note) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NotesTree = ({ onNoteSelected }: NotesTreeProps) => {
	const isRebuildingTree = useAppSelector(
		state => state.noteManagement.isRebuilding
	)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		void dispatch(rebuildTree())
	}, [dispatch])

	if (isRebuildingTree) {
		return (
			<div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
				<span>Building Tree...</span>
				<Spinner />
			</div>
		)
	}

	return (
		<div className="w-full">
			<NotesTreeRoot onNoteSelected={onNoteSelected} />
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
	const treeNode = useAppSelector(state =>
		folder
			? state.noteManagement.tree[folderFullPath]
			: {
					folders: [],
					notes: []
			  }
	)
	const isOpen = folder?.isOpen
	// const isRenaming = folder?.isRenaming
	const dispatch = useAppDispatch()

	const folderRef = React.useRef<HTMLButtonElement>(null)

	const onContextMenu = () => {
		if (!folder) return
		dispatch(selectFolder({ path: folder.path }))
		window.contextMenu.createContextMenu([
			{
				label: 'New Note',
				click: () => {
					void window.api.noteFileSystem.CreateNote({
						path: folderFullPath,
						name: 'New Note'
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
	}

	if (!folder) return null

	return (
		<div className="flex flex-col">
			<button
				ref={folderRef}
				onClick={onToggleFolder}
				className="flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800  dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent"
			>
				{isOpen ? (
					<Icons.chevronDown size={16} className="min-h-[16px] min-w-[16px]" />
				) : (
					<Icons.chevronRight size={16} className="min-h-[16px] min-w-[16px]" />
				)}
				{isOpen ? (
					<Icons.folderOpen
						size={16}
						className="ml-1 min-h-[16px] min-w-[16px]"
					/>
				) : (
					<Icons.folder size={16} className="ml-1 min-h-[16px] min-w-[16px]" />
				)}
				<span className="ml-2 line-clamp-1 text-start">{folder.name}</span>
			</button>
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

	if (!note) return null

	const noteName = note.name.split('.')[0]

	return (
		<button
			ref={noteRef}
			className="flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-light transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800  dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent"
			onKeyDown={handleKeyDown}
			onClick={() => onNoteSelected(note)}
		>
			<Icons.page size={16} className="ml-5 min-h-[16px] min-w-[16px]" />
			{/* {!note.isRenaming ? ( */}
			<div className="ml-4 line-clamp-1 text-start">{noteName}</div>
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
