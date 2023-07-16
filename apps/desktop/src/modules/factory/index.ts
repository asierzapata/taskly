import type { BrowserWindow, IpcMain, IpcRenderer } from 'electron'

export function createEvent<K extends string, I, E>(id: K) {
	return {
		main: (window: BrowserWindow) =>
			({
				[id]: (event: E): void => {
					window.webContents.send(id, event)
				}
			} as Record<K, (event: E) => void>),
		render: (ipcRenderer: IpcRenderer) =>
			({
				[`On${id}`]: (callback: (event: E) => void) => {
					const handler = (_event: unknown, event: E) => {
						callback(event)
					}
					ipcRenderer.on(id, handler)
					return () => ipcRenderer.removeListener(id, handler)
				}
			} as Record<
				`On${K}`,
				(callback: (event: E) => void) => () => Electron.IpcRenderer
			>)
	}
}

export function createCommand<K extends string, I, O, D>(
	id: K,
	method: ({
		parameters,
		dependencies,
		_event
	}: {
		parameters: I
		dependencies: D
		_event?: Electron.IpcMainInvokeEvent
	}) => Promise<O>
) {
	return {
		main: ({
			ipcMain,
			window,
			dependencies
		}: {
			window: BrowserWindow
			ipcMain: IpcMain
			dependencies: D
		}) => {
			ipcMain.handle(
				id,
				async (_event: Electron.IpcMainInvokeEvent, parameters: I) => {
					const response = await method({ _event, parameters, dependencies })
					window.webContents.send(id, response)
					return response
				}
			)
			return {
				[id]: async (parameters: I): Promise<O> => {
					const response = await method({ parameters, dependencies })
					console.log('>>>>>>', 'send', 'id', id)
					window.webContents.send(id, response)
					return response
				}
			} as Record<K, (payload: I) => Promise<O>>
		},
		render: (ipcRenderer: IpcRenderer) =>
			({
				[`On${id}`]: (callback: (payload: O) => void) => {
					const handler = (_event: unknown, payload: O) => {
						callback(payload)
					}
					ipcRenderer.on(id, handler)
					return () => ipcRenderer.removeListener(id, handler)
				},
				[id]: async (payload: I): Promise<O> => {
					const response = ipcRenderer.invoke(id, payload)
					return response as Promise<O>
				}
			} as Record<
				`On${K}`,
				(callback: (payload: O) => void) => () => Electron.IpcRenderer
			> &
				Record<K, (payload: I) => Promise<O>>)
	}
}

// export function createMethodCalledFromMain<K extends string, I, O, D>(
// 	id: K,
// 	method: ({
// 		parameters,
// 		dependencies
// 	}: {
// 		parameters: I
// 		dependencies: D
// 	}) => Promise<O>
// ) {
// 	return {
// 		main: (window: BrowserWindow, dependencies: D) =>
// 			({
// 				[id]: async (parameters: I): Promise<O> => {
// 					const response = await method({ parameters, dependencies })
// 					window.webContents.send(id, response)
// 					return response
// 				}
// 			} as Record<K, (payload: I) => Promise<O>>),
// 		render: (ipcRenderer: IpcRenderer) =>
// 			({
// 				[`On${id}`]: (callback: (payload: O) => void) =>
// 					ipcRenderer.on(id, (_event, payload: O) => {
// 						callback(payload)
// 					})
// 			} as Record<
// 				`On${K}`,
// 				(callback: (payload: O) => void) => Electron.IpcRenderer
// 			>)
// 	}
// }

// export function createMethodCalledFromRender<K extends string, I, O, D>(
// 	id: K,
// 	method: ({
// 		_event,
// 		parameters,
// 		dependencies
// 	}: {
// 		_event: Electron.IpcMainInvokeEvent
// 		parameters: I
// 		dependencies: D
// 	}) => Promise<O>
// ) {
// 	return {
// 		main: (ipcMain: IpcMain, dependencies: D) => {
// 			ipcMain.handle(id, (_event: Electron.IpcMainInvokeEvent, parameters: I) =>
// 				method({ _event, parameters, dependencies })
// 			)
// 			return {}
// 		},
// 		render: (ipcRenderer: IpcRenderer) =>
// 			({
// 				[id]: async (payload: I): Promise<O> => {
// 					const response = ipcRenderer.invoke(id, payload)
// 					return response as Promise<O>
// 				}
// 			} as Record<K, (payload: I) => Promise<O>>)
// 	}
// }
