import { BrowserWindow, IpcMainEvent, Menu, MenuItem, ipcMain } from 'electron'
import {
	CONTEXT_MENU_CHANNEL,
	CONTEXT_MENU_CLOSE_CHANNEL,
	PopupOptions,
	SerializableContextMenuItem
} from '../common/context_menus_common'

export function registerContextMenuListener(): void {
	ipcMain.on(
		CONTEXT_MENU_CHANNEL,
		(
			event: IpcMainEvent,
			contextMenuId: number,
			items: SerializableContextMenuItem[],
			onClickChannel: string,
			options?: PopupOptions
		) => {
			const menu = createMenu(event, onClickChannel, items)

			menu.popup({
				window: BrowserWindow.fromWebContents(event.sender) ?? undefined,
				x: options ? options.x : undefined,
				y: options ? options.y : undefined,
				positioningItem: options ? options.positioningItem : undefined,
				callback: () => {
					if (menu) {
						event.sender.send(CONTEXT_MENU_CLOSE_CHANNEL, contextMenuId)
					}
				}
			})
		}
	)
}

function createMenu(
	event: IpcMainEvent,
	onClickChannel: string,
	items: SerializableContextMenuItem[]
): Menu {
	const menu = new Menu()

	items.forEach(item => {
		let menuitem: MenuItem

		// Separator
		if (item.type === 'separator') {
			menuitem = new MenuItem({
				type: item.type
			})
		}

		// Sub Menu
		else if (Array.isArray(item.submenu)) {
			menuitem = new MenuItem({
				submenu: createMenu(event, onClickChannel, item.submenu),
				label: item.label
			})
		}

		// Normal Menu Item
		else {
			menuitem = new MenuItem({
				label: item.label,
				type: item.type,
				accelerator: item.accelerator,
				checked: item.checked,
				enabled: item.enabled,
				visible: item.visible,
				click: (menuItem, win, contextmenuEvent) =>
					event.sender.send(onClickChannel, item.id, contextmenuEvent)
			})
		}

		menu.append(menuitem)
	})

	return menu
}
