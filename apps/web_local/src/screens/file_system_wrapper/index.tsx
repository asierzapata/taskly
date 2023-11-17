import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Button, H1 } from '@taskly/web-ui'
import { useFileSystem } from '@/lib/file_system'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const FileSystemWrapper = () => {
	const navigate = useNavigate()
	const {
		isSupported,
		setRootDirectory,
		isWritePermissionGranted,
		grantWritePermission,
		directoryName
	} = useFileSystem()

	const handleGrantWritePermission = () => {
		void grantWritePermission()
	}

	const handleSetRootDirectory = () => {
		void setRootDirectory({
			withWritePermission: true
		})
	}

	useEffect(() => {
		if (isSupported && isWritePermissionGranted && !isEmpty(directoryName)) {
			navigate(`/home`)
		}
	}, [
		directoryName,
		isSupported,
		isWritePermissionGranted,
		navigate,
		setRootDirectory
	])

	if (!isSupported) {
		return (
			<div className="m-auto flex h-full min-h-screen max-w-xl flex-col items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center p-4 pl-10 text-center">
					<H1>File System Not Supported</H1>
					<p className="mt-3">
						Your platform does not support the File System API. Update your
						browser or install a compatible browser.
					</p>
				</div>
			</div>
		)
	}

	if (!isWritePermissionGranted && !isEmpty(directoryName)) {
		return (
			<div className="m-auto flex h-full min-h-screen max-w-xl flex-col items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center p-4 pl-10 text-center">
					<H1>Grant Permission</H1>
					<p className="mt-3">
						To start using Taskly, you need to grant permission to access your
						local storage.
					</p>
					<Button onClick={handleGrantWritePermission} className="mt-6">
						Grant Permission
					</Button>
				</div>
			</div>
		)
	}

	if (isEmpty(directoryName)) {
		return (
			<div className="m-auto flex h-full min-h-screen max-w-xl flex-col items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center p-4 pl-10 text-center">
					<H1>Select Folder</H1>
					<p className="mt-3">
						To start using Taskly, you need to select a folder to store your
						notes.
					</p>
					<Button onClick={handleSetRootDirectory} className="mt-6" size="sm">
						Select Folder
					</Button>
				</div>
			</div>
		)
	}

	return <Outlet />
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { FileSystemWrapper }
