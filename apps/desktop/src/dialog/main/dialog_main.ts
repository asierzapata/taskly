import {
	BrowserWindow,
	IpcMainEvent,
	type IpcMainInvokeEvent,
	type OpenDialogOptions,
	dialog,
	ipcMain
} from 'electron'
import { OPEN_DIALOG_CHANNEL } from '../common/dialog_common'

export function registerDialogListeners(): void {
	ipcMain.handle(
		OPEN_DIALOG_CHANNEL,
		async (event: IpcMainInvokeEvent, options: OpenDialogOptions) => {
			const window = BrowserWindow.fromWebContents(event.sender)

			if (!window) {
				return
			}

			const response = await dialog.showOpenDialog(window, options)

			return response
		}
	)
}
