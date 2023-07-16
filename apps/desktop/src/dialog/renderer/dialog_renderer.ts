import {
	OPEN_DIALOG_CHANNEL,
	OpenDialogResponse
} from '../common/dialog_common'
import { OpenDialogOptions, ipcRenderer } from 'electron'

export async function openDialog(
	options?: OpenDialogOptions
): Promise<OpenDialogResponse> {
	const response = await ipcRenderer.invoke(OPEN_DIALOG_CHANNEL, options)
	return response
}
