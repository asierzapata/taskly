// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from 'electron'

import { API } from '@main/window_api'

contextBridge.exposeInMainWorld('api', API)

declare global {
	interface Window {
		api: typeof API
	}
}
