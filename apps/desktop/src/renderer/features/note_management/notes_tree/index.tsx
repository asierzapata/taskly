import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
	rebuildTree,
	selectFolder,
	toggleDirectory
} from '../note_management_slice'
import { Directory, Folder, Note } from '../types'
import { Dir } from 'original-fs'
import { Icons, Spinner } from '@taskly/web-ui'

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

	const rootDirectory = tree['/']

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
			{rootDirectory && (
				<Directory isRoot name="Notes" directory={rootDirectory} />
			)}
		</div>
	)
}

const Directory = ({
	isRoot,
	name,
	directory
}: {
	isRoot?: boolean
	name: string
	directory: Directory
}) => {
	const tree = useAppSelector(state => state.noteManagement.tree)
	const isOpen = directory.isOpen
	const dispatch = useAppDispatch()

	const folderRef = React.useRef<HTMLButtonElement>(null)

	React.useEffect(() => {
		const onContextMenu = (event: MouseEvent) => {
			if (folderRef.current?.contains(event.target as Node)) {
				event.preventDefault()
				event.stopPropagation()
				dispatch(selectFolder({ path: directory.path }))
				// window.menus.ShowFolderMenu({
				// 	folderPath: directory.path
				// })
			}
		}

		window.addEventListener('contextmenu', onContextMenu)

		return () => {
			window.removeEventListener('contextmenu', onContextMenu)
		}
	}, [])

	const onToggleDirectory = () => {
		dispatch(toggleDirectory({ path: directory.path }))
	}

	return (
		<div className="flex flex-col">
			{!isRoot && (
				<button
					ref={folderRef}
					onClick={onToggleDirectory}
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
					<div className="ml-2">{name}</div>
				</button>
			)}
			{isOpen || isRoot ? (
				<div className={!isRoot ? 'ml-4' : ''}>
					{directory.folders.map(folder => {
						const _directory = tree[folder.path]
						if (!_directory) return null
						return (
							<Directory
								key={folder.path}
								name={folder.name}
								directory={_directory}
							/>
						)
					})}
					{directory.notes.map(note => (
						<Note key={note.path} note={note} />
					))}
				</div>
			) : null}
		</div>
	)
}

const Note = ({ note }: { note: Note }) => {
	const noteRef = React.useRef<HTMLButtonElement>(null)

	React.useEffect(() => {
		const onContextMenu = (event: MouseEvent) => {
			if (noteRef.current?.contains(event.target as Node)) {
				event.preventDefault()
				event.stopPropagation()
				window.contextMenu.createContextMenu([
					{
						label: 'Rename',
						click: () => {
							console.log('Rename')
						}
					},
					{
						label: 'Delete',
						click: () => {
							console.log('Delete')
						}
					}
				])
			}
		}

		window.addEventListener('contextmenu', onContextMenu)

		return () => {
			window.removeEventListener('contextmenu', onContextMenu)
		}
	}, [])

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
