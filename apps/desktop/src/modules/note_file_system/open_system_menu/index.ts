import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'
import { BrowserWindow, IpcMainInvokeEvent, Menu } from 'electron'

type OpenSystemMenuParameters = {
	template: Electron.MenuItemConstructorOptions[]
}
type OpenSystemMenuResponse = void

export const OpenSystemMenu = async ({
	_event,
	parameters: { template },
	dependencies
}: {
	_event: IpcMainInvokeEvent
	parameters: OpenSystemMenuParameters
	dependencies: ModuleDependencies
}): Promise<OpenSystemMenuResponse> => {
	const menu = Menu.buildFromTemplate(template)
	menu.popup({
		window: BrowserWindow.fromWebContents(_event.sender) ?? undefined
	})
}

export const OpenSystemMenuGenerator = createMethodCalledFromRender<
	'OpenSystemMenu',
	OpenSystemMenuParameters,
	OpenSystemMenuResponse,
	ModuleDependencies
>('OpenSystemMenu', OpenSystemMenu)
