export type OpenDialogResponse = {
	filePaths: string[]
	canceled: boolean
}

export const OPEN_DIALOG_CHANNEL = 'taskly:open-dialog'
