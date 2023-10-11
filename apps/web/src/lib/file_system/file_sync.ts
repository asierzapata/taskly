import { useCallback } from 'react'
import type * as Y from 'yjs'
import {
	createFile,
	getFSFileHandle,
	writeContentToFileIfChanged
} from './helpers'
import { getLastWriteCacheData, setLastWriteCacheData } from './cache'
import { getDeltaOperations } from './yjs'

export const useFileSync = () => {
	const syncDoc = useCallback(
		async ({
			doc,
			name,
			directoryHandle
		}: {
			doc: Y.Doc
			name: string
			directoryHandle: FileSystemDirectoryHandle
		}) => {
			const updateFileContent = async (
				file: globalThis.File,
				fileHandle: FileSystemFileHandle,
				newContent: string
			) => {
				console.log('>>>>>> updateFileContent', {
					file,
					fileHandle,
					newContent
				})
				// When we write to the file system, we also save a version
				// in cache in order to be able to watch for subsequent changes
				// to the file.
				await writeContentToFileIfChanged(file, fileHandle, newContent)
				await setLastWriteCacheData(name, newContent, file.lastModified)
			}

			const fileHandle = await getFSFileHandle(name, directoryHandle)
			const docContent = doc.getText().toString()

			console.log('>>>>>> 1', {
				name,
				fileHandle,
				docContent
			})

			if (!fileHandle) {
				// File is not present in the file system, so create it.
				const newFileHandle = await createFile(directoryHandle, name, '')
				const newFile = await newFileHandle.getFile()
				await updateFileContent(newFile, newFileHandle, docContent)
				return
			}

			const file = await fileHandle.getFile()

			// File exists, so compare it with the last-write-cache.
			const lastWriteCacheData = await getLastWriteCacheData(name)

			console.log('>>>>>> 2', {
				name,
				lastWriteCacheData
			})

			if (!lastWriteCacheData) {
				// Cached version does not exist. This should never happen. Indeed,
				// even if the user clears the app data, the directory handle will
				// be cleared as well, so the user will be asked to select a directory
				// again, in which case a hard overwrite will happen, and the
				// last-write-cache will be populated. So in case `lastWriteCacheData`
				// does not exist, we can consider this situation as similar to the
				// initial file dump situation.
				const fileContent = await file.text()
				doc.getText().insert(0, fileContent)
				console.log('>>>>>>', '2.1', {
					file,
					fileContent,
					docContent
				})
				await updateFileContent(file, fileHandle, doc.getText().toString())
				return
			}

			// Cached version exists. This allows us to see the changes in the
			// local file, and compute the diff which in turn gives us as
			// state update vector for our CRDT. We can then apply it
			// to the app file for a seamless merging of the two versions.

			console.log('>>>>>>', '3', {
				file,
				lastWriteCacheData
			})

			if (file.lastModified === lastWriteCacheData.lastModified) {
				// File has not changed in the file system. Since the FS file cache
				// is only set when a project file is synced, this means that the
				// only option is that the app file has changed, in which
				// case it should be written to the FS file.
				await updateFileContent(file, fileHandle, docContent)
				return
			}

			// File has changed in the file system.

			const fileContent = await file.text()
			const lastWriteFileContent = lastWriteCacheData.content
			const deltas = getDeltaOperations(lastWriteFileContent, fileContent)

			console.log('>>>>>> 4', {
				fileContent,
				lastWriteFileContent,
				deltas
			})

			if (deltas.length === 0) {
				// Same comment as above: no difference between FS file and
				// and last-write-cache, so just write the app file to FS.
				await updateFileContent(file, fileHandle, docContent)
				return
			}

			// A change has happened in the file, since it differs
			// from the cached version. So we merge it with the app doc.
			doc.getText().applyDelta(deltas)

			const mergedContent = doc.getText().toString()
			await updateFileContent(file, fileHandle, mergedContent)
		},
		[]
	)

	return {
		syncDoc
	}
}
