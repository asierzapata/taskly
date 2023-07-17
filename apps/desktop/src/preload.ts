// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { API } from '@modules/render_api'
import { contextBridge, ipcRenderer } from 'electron'
import { createContextMenu } from './context_menus/renderer/context_menus_renderer'
import { openDialog } from './dialog/renderer/dialog_renderer'

contextBridge.exposeInMainWorld(
	'api',
	API({
		ipcRenderer
	})
)

contextBridge.exposeInMainWorld('contextMenu', {
	createContextMenu
})

contextBridge.exposeInMainWorld('filePicker', {
	openDialog
})

declare global {
	interface Window {
		api: ReturnType<typeof API>
		contextMenu: {
			createContextMenu: typeof createContextMenu
		}
		filePicker: {
			openDialog: typeof openDialog
		}
	}
}
