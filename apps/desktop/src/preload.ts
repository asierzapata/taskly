// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { API } from '@main/window_api'
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', API)

declare global {
	interface Window {
		api: typeof API
	}
}
