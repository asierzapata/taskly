import { useCallback, useEffect, useMemo, useState } from 'react'
import { set as idbSet, get as idbGet, del as idbDel } from 'idb-keyval'
import { STORE_KEY_DIRECTORY_HANDLE } from './constants'
import { askReadWritePermissionsIfNeeded } from './helpers'

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
			const handle = await idbGet<FileSystemDirectoryHandle>(
				STORE_KEY_DIRECTORY_HANDLE
			)
			if (handle) {
				setDirectoryHandle(handle)
			}
		}
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
		async (handler: FileSystemDirectoryHandle) => {
			if (!handler) {
				return []
			}
			const entries = []
			for await (const entry of handler.values()) {
				entries.push(entry)
			}
			return entries
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
		getDirectoryEntries
	}
}
