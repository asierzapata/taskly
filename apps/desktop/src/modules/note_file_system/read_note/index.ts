import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'

type ReadNoteParameters = {
	path: string
	name: string
}
type ReadNoteResponse = {
	content: string
}

export const ReadNote = async ({
	parameters: { path, name },
	dependencies
}: {
	parameters: ReadNoteParameters
	dependencies: ModuleDependencies
}): Promise<ReadNoteResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteNotePath(path, name)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	console.log('>>>>>>', {
		absolutePath,
		stats
	})

	if (!stats.isFile()) {
		throw new Error('Path is not a file')
	}

	const content = await dependencies.fs.readFile(absolutePath, {
		encoding: 'utf-8'
	})

	return {
		content
	}
}

export const ReadNoteGenerator = createCommand<
	'ReadNote',
	ReadNoteParameters,
	ReadNoteResponse,
	ModuleDependencies
>('ReadNote', ReadNote)
