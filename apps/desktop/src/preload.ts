// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { API } from '@modules/render_api'
import { contextBridge } from 'electron'
import { createContextMenu } from './context_menus/renderer/context_menus_renderer'

contextBridge.exposeInMainWorld('api', API)

contextBridge.exposeInMainWorld('contextMenu', {
	createContextMenu
})

declare global {
	interface Window {
		api: typeof API
		contextMenu: {
			createContextMenu: typeof createContextMenu
		}
	}
}
