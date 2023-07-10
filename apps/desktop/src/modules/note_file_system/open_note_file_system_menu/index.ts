import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'
import { Folder, File } from '../types'
import { BrowserWindow, IpcMainInvokeEvent, Menu } from 'electron'
import { CreateNote } from '../create_note'
import { CreateFolder } from '../create_folder'

type OpenNoteFileSystemMenuParameters = void
type OpenNoteFileSystemMenuResponse = void

export const OpenNoteFileSystemMenu = async ({
	_event,
	parameters,
	dependencies
}: {
	_event: IpcMainInvokeEvent
	parameters: OpenNoteFileSystemMenuParameters
	dependencies: ModuleDependencies
}): Promise<OpenNoteFileSystemMenuResponse> => {
	const template = [
		{
			label: 'Create Note',
			click: () => {
				CreateNote({
					parameters: {
						path: '/untitled.md'
					},
					dependencies
				})
			}
		},
		{
			label: 'Create Folder',
			click: () => {
				CreateFolder({
					parameters: {
						path: '/untitled'
					},
					dependencies
				})
			}
		}
	]
	const menu = Menu.buildFromTemplate(template)
	menu.popup({
		window: BrowserWindow.fromWebContents(_event.sender) ?? undefined
	})
}

export const OpenNoteFileSystemMenuGenerator = createMethodCalledFromRender<
	'OpenNoteFileSystemMenu',
	OpenNoteFileSystemMenuParameters,
	OpenNoteFileSystemMenuResponse,
	ModuleDependencies
>('OpenNoteFileSystemMenu', OpenNoteFileSystemMenu)
