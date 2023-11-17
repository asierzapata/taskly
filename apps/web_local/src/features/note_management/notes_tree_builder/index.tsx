/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useFileSystem } from '@/lib/file_system'
import { Spinner } from '@taskly/web-ui'
import { useEffect } from 'react'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

/* ====================================================== */
/*                       Types                            */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NotesTreeBuilder = ({ onTreeBuilt }: { onTreeBuilt: () => void }) => {
	const { buildFileSystemTree } = useFileSystem()

	useEffect(() => {
		const buildTree = async () => {
			await buildFileSystemTree()
			onTreeBuilt()
		}
		void buildTree()
	}, [buildFileSystemTree, onTreeBuilt])

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<p>Building Tree...</p>
			<Spinner />
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NotesTreeBuilder }
