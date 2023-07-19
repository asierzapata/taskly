import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type WriteNoteParameters = {
	path: string
	name: string
	content: string
}
type WriteNoteResponse = {
	path: string
	name: string
	content: string
}

export const WriteNote = async ({
	parameters: { path, name, content },
	dependencies
}: {
	parameters: WriteNoteParameters
	dependencies: ModuleDependencies
}): Promise<WriteNoteResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteNotePath(path, name)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isFile()) {
		throw new Error('Path is not a file')
	}

	await dependencies.fs.writeFile(absolutePath, content, {
		encoding: 'utf-8'
	})

	return {
		path,
		name,
		content
	}
}

export const WriteNoteGenerator = createCommand<
	'WriteNote',
	WriteNoteParameters,
	WriteNoteResponse,
	ModuleDependencies
>('WriteNote', WriteNote)
