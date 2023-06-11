import type { BrowserWindow, IpcMain, IpcRenderer } from 'electron'

export function createMethodCalledFromMain<K extends string, I, O, D>(
	id: K,
	method: ({
		parameters,
		dependencies
	}: {
		parameters: I
		dependencies: D
	}) => Promise<O>
) {
	return {
		main: (window: BrowserWindow, dependencies: D) =>
			({
				[id]: async (parameters: I): Promise<O> => {
					const response = await method({ parameters, dependencies })
					window.webContents.send(id, response)
					return response
				}
			} as Record<K, (payload: I) => Promise<O>>),
		render: (ipcRenderer: IpcRenderer) =>
			({
				[`On${id}`]: (callback: (payload: O) => void) =>
					ipcRenderer.on(id, (_event, payload: O) => {
						callback(payload)
					})
			} as Record<
				`On${K}`,
				(callback: (payload: O) => void) => Electron.IpcRenderer
			>)
	}
}

export function createMethodCalledFromRender<K extends string, I, O, D>(
	id: K,
	method: ({
		_event,
		parameters,
		dependencies
	}: {
		_event: Electron.IpcMainInvokeEvent
		parameters: I
		dependencies: D
	}) => Promise<O>
) {
	return {
		main: (ipcMain: IpcMain, dependencies: D) => {
			ipcMain.handle(id, (_event: Electron.IpcMainInvokeEvent, parameters: I) =>
				method({ _event, parameters, dependencies })
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
