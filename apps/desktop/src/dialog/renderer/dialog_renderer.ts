import { ipcRenderer } from 'electron'
import {
	OPEN_DIALOG_CHANNEL,
	type OpenDialogResponse
} from '../common/dialog_common'
import { type OpenDialogOptions } from 'electron'

export async function openDialog(
	options?: OpenDialogOptions
): Promise<OpenDialogResponse> {
	const response = await ipcRenderer.invoke(OPEN_DIALOG_CHANNEL, options)
	return response
}
