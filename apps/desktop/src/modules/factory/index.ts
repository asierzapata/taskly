import type { BrowserWindow, IpcMain, IpcRenderer } from 'electron'

export function createMethodCalledFromMain<K extends string, I, O>(
	id: K,
	method: (input: I) => Promise<O>
) {
	return {
		main: (window: BrowserWindow) =>
			({
				[id]: async (payload: I): Promise<O> => {
					const response = method(payload)
					window.webContents.send(id, response)
					return response
				}
			} as Record<K, (payload: I) => Promise<O>>),
		render: (ipcRenderer: IpcRenderer) =>
			({
				[`on${id}`]: (callback: (payload: O) => void) =>
					ipcRenderer.on(id, (_event, payload: O) => {
						callback(payload)
					})
			} as Record<
				`on${K}`,
				(callback: (payload: O) => void) => Electron.IpcRenderer
			>)
	}
}

export function createMethodCalledFromRender<K extends string, I, O, D>(
	id: K,
	method: (
		_event: Electron.IpcMainInvokeEvent,
		input: I,
		dependencies: D
	) => Promise<O>
) {
	return {
		main: (ipcMain: IpcMain, dependencies: D) => {
			ipcMain.handle(id, (_event: Electron.IpcMainInvokeEvent, input: I) =>
				method(_event, input, dependencies)
			)
			return {}
		},
		render: (ipcRenderer: IpcRenderer) =>
			({
				[id]: async (payload: I): Promise<O> => {
					const response = ipcRenderer.invoke(id, payload)
					return response as Promise<O>
				}
			} as Record<K, (payload: I) => Promise<O>>)
	}
}
