import { useCallback, useEffect, useMemo, useState } from 'react'
import { set as idbSet, get as idbGet, del as idbDel } from 'idb-keyval'
import {
	STORE_KEY_CACHED_NORMALIZED_FILES,
	STORE_KEY_CACHED_TREE,
	STORE_KEY_DIRECTORY_HANDLE
} from './constants'
import {
	askReadWritePermissionsIfNeeded,
	createFile,
	deleteFile,
	moveFile,
	renameFile,
	createFolderInFolder,
	renameFolder,
	moveFolder,
	moveFolderContent,
	deleteFolder,
	getFSFileHandle,
	writeContentToFileIfChanged
} from './helpers'
import { type FileSystemFile, type FileSystemTreeNode } from './types'

export const useFileSystem = () => {
	const [isSupported, setSupported] = useState(false)
	const [isWritePermissionGranted, setWritePermissionGranted] = useState(false)
	const [directoryHandle, setDirectoryHandle] = useState<
		FileSystemDirectoryHandle | undefined
	>(undefined)

	useEffect(() => {
		setSupported(typeof window.showDirectoryPicker === 'function')
	}, [])

	useEffect(() => {
		const loadHandle = async () => {
			console.log('>>>>>>', 'loadHandle')
			const handle = await idbGet<FileSystemDirectoryHandle>(
				STORE_KEY_DIRECTORY_HANDLE
			)
			console.log('>>>>>>', 'loadHandle', handle)
			if (handle) {
				setDirectoryHandle(handle)
			}
		}
		console.log('>>>>>>', 'loadHandle before')
		void loadHandle()
	}, [])

	useEffect(() => {
		if (directoryHandle) {
			void idbSet(STORE_KEY_DIRECTORY_HANDLE, directoryHandle)
		}
	}, [directoryHandle])

	const grantWritePermission = useCallback(async () => {
		if (!isSupported || !directoryHandle) {
			return
		}
		try {
			const granted = await askReadWritePermissionsIfNeeded(directoryHandle)
			setWritePermissionGranted(granted)
		} catch {}
	}, [isSupported, directoryHandle])

	const setRootDirectory = useCallback(
		async ({ withWritePermission }: { withWritePermission: boolean }) => {
			if (!isSupported) {
				return
			}
			try {
				const handle = await window.showDirectoryPicker()
				if (handle) {
					setDirectoryHandle(handle)
					if (withWritePermission) {
						const granted = await askReadWritePermissionsIfNeeded(handle)
						setWritePermissionGranted(granted)
					}
				}
			} catch {}
		},
		[isSupported]
	)

	const unsetRootDirectory = useCallback(async () => {
		setDirectoryHandle(undefined)
		await idbDel(STORE_KEY_DIRECTORY_HANDLE)
	}, [])

	const directoryName = useMemo(() => {
		return directoryHandle?.name
	}, [directoryHandle])

	const getDirectoryEntries = useCallback(
		async (
			handler: FileSystemDirectoryHandle,
			options: {
				allowedFileExtensions?: string[]
			} = {
				allowedFileExtensions: ['md']
			}
		) => {
			if (!handler) {
				return []
			}
			const entries = []
			for await (const entry of handler.values()) {
				if (entry.kind === 'file') {
					if (options.allowedFileExtensions) {
						const extension = entry.name.split('.').pop()
						if (
							!extension ||
							!options.allowedFileExtensions.includes(extension)
						) {
							continue
						}
					}
				}
				entries.push(entry)
			}

			const orderedEntries = entries.sort((a, b) => {
				if (a.kind === b.kind) {
					return a.name.localeCompare(b.name)
				}
				if (a.kind === 'directory') {
					return -1
				}
				return 1
			})

			return orderedEntries
		},
		[]
	)

	const getFileHandle = useCallback(
		async (name: string) => {
			if (!directoryHandle) {
				return
			}
			try {
				return getFSFileHandle(name, directoryHandle)
			} catch {
				return
			}
		},
		[directoryHandle]
	)

	const buildDirectoryLevelTree = useCallback(
		async (
			handle: FileSystemDirectoryHandle,
			parentHandle: FileSystemDirectoryHandle,
			normalizedFiles: Record<string, FileSystemFile> = {},
			options: {
				allowedFileExtensions?: string[]
			} = {
				allowedFileExtensions: ['md']
			}
		): Promise<FileSystemTreeNode> => {
			const entries = await getDirectoryEntries(handle, options)
			const treeLevel: FileSystemTreeNode = {
				name: handle.name,
				parentHandle,
				handle,
				files: [],
				folders: []
			}
			for (const entry of entries) {
				if (entry.kind === 'file') {
					const file = {
						id: `${Date.now() + Math.floor(Math.random() * 10000)}`,
						name: entry.name,
						formatedName: entry.name.replace(/\.[^/.]+$/, ''),
						type: 'file' as const,
						handle: entry,
						parentHandle: handle
					}
					treeLevel.files.push(file)
					normalizedFiles[file.id] = file
				} else if (entry.kind === 'directory') {
					const subTree = await buildDirectoryLevelTree(
						entry,
						handle,
						normalizedFiles,
						options
					)
					treeLevel.folders.push(subTree)
				}
			}
			return treeLevel
		},
		[getDirectoryEntries]
	)

	const buildFileSystemTree = useCallback(async (): Promise<void> => {
		if (!directoryHandle) {
			throw new Error('No directory handle')
		}
		const normalizedFiles: Record<string, FileSystemFile> = {}
		const tree = await buildDirectoryLevelTree(
			directoryHandle,
			directoryHandle,
			normalizedFiles,
			{
				allowedFileExtensions: ['md']
			}
		)
		console.log('>>>>>>', tree)
		await idbSet(STORE_KEY_CACHED_TREE, tree)
		await idbSet(STORE_KEY_CACHED_NORMALIZED_FILES, normalizedFiles)
		return
	}, [buildDirectoryLevelTree, directoryHandle])

	const getFileSystemTree = useCallback(async () => {
		const tree = await idbGet<FileSystemTreeNode>(STORE_KEY_CACHED_TREE)
		return tree
	}, [])

	const getNormalizedFiles = useCallback(async () => {
		const normalizedFiles = await idbGet<Record<string, FileSystemFile>>(
			STORE_KEY_CACHED_NORMALIZED_FILES
		)
		return normalizedFiles
	}, [])

	const updateFileContent = useCallback(
		async (
			file: globalThis.File,
			fileHandle: FileSystemFileHandle,
			newContent: string
		) => {
			await writeContentToFileIfChanged(file, fileHandle, newContent)
		},
		[]
	)

	return {
		directoryHandle,
		directoryName,
		isSupported,
		setRootDirectory,
		unsetRootDirectory,
		grantWritePermission,
		isWritePermissionGranted,
		buildFileSystemTree,
		getFileSystemTree,
		getNormalizedFiles,
		getDirectoryEntries,
		getFileHandle,
		createFile,
		deleteFile,
		moveFile,
		renameFile,
		updateFileContent,
		createFolderInFolder,
		renameFolder,
		moveFolder,
		moveFolderContent,
		deleteFolder
	}
}
