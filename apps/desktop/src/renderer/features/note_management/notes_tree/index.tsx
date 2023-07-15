import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
	rebuildTree,
	selectFolder,
	startRenamingFolder,
	startRenamingNote,
	toggleFolder
} from '../note_management_slice'
import { Folder, Note } from '../types'
import { Dir } from 'original-fs'
import { Icons, Spinner } from '@taskly/web-ui'
import { useContextMenu } from '@renderer/lib/context_menu'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NotesTree = ({}) => {
	const tree = useAppSelector(state => state.noteManagement.tree)
	const isRebuildingTree = useAppSelector(
		state => state.noteManagement.isRebuilding
	)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		dispatch(rebuildTree()).unwrap()
	}, [])

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
			<NotesTreeRoot />
		</div>
	)
}

const NotesTreeRoot = () => {
	const treeNode = useAppSelector(state => state.noteManagement.tree['/'])

	return (
		<div className="h-full w-full">
			{treeNode?.folders.map(folder => (
				<Folder id={folder.id} />
			))}
			{treeNode?.notes.map(note => (
				<Note id={note.id} />
			))}
		</div>
	)
}

const Folder = ({ id }: { id: string }) => {
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
	const isRenaming = folder?.isRenaming
	const dispatch = useAppDispatch()

	const folderRef = React.useRef<HTMLButtonElement>(null)

	const onContextMenu = () => {
		if (!folder) return
		dispatch(selectFolder({ path: folder.path }))
		window.contextMenu.createContextMenu([
			{
				label: 'New Note',
				click: () => {
					console.log('>>>>>>', 'folderFullPath', folderFullPath)
					window.api.noteFileSystem.CreateNote({
						path: folderFullPath,
						name: 'New Note'
					})
				}
			},
			{
				label: 'New Folder',
				click: () => {
					console.log('>>>>>>', 'folderFullPath', folderFullPath)
					window.api.noteFileSystem.CreateFolder({
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
					console.log('>>>>>>', 'folder', folder)
					dispatch(startRenamingFolder({ id: folder.id }))
				}
			},
			{
				label: 'Delete',
				click: () => {
					console.log('>>>>>>', 'folder', folder)
					window.api.noteFileSystem.DeleteFolder({
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
				className="flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800  dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent"
			>
				{isOpen ? (
					<Icons.chevronDown size={16} />
				) : (
					<Icons.chevronRight size={16} />
				)}
				{isOpen ? (
					<Icons.folderOpen size={16} className="ml-1" />
				) : (
					<Icons.folder size={16} className="ml-1" />
				)}
				<div className="ml-2">{folder.name}</div>
			</button>
			{isOpen ? (
				<div className={'ml-4'}>
					{treeNode?.folders.map(folder => {
						return <Folder key={folder.id} id={folder.id} />
					})}
					{treeNode?.notes.map(note => (
						<Note key={note.id} id={note.id} />
					))}
				</div>
			) : null}
		</div>
	)
}

const Note = ({ id }: { id: string }) => {
	const note = useAppSelector(state => state.noteManagement.notes[id])
	const noteRef = React.useRef<HTMLButtonElement>(null)
	const dispatch = useAppDispatch()

	const onContextMenu = () => {
		window.contextMenu.createContextMenu([
			{
				label: 'Rename',
				click: () => {
					dispatch(startRenamingNote({ id }))
				}
			},
			{
				label: 'Delete',
				click: () => {
					if (!note) return
					window.api.noteFileSystem.DeleteNote({
						path: note.path,
						name: note.name
					})
				}
			}
		])
	}

	useContextMenu({ ref: noteRef, onContextMenu })

	if (!note) return null

	return (
		<button
			ref={noteRef}
			className="flex w-full flex-row items-center justify-start rounded-md bg-transparent p-1 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800  dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:bg-transparent"
		>
			<Icons.page size={16} className="ml-1" />
			<div className="ml-2">{note.name}</div>
		</button>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NotesTree }
