import {
	CONTEXT_MENU_CHANNEL,
	CONTEXT_MENU_CLOSE_CHANNEL,
	ContextMenuEvent,
	ContextMenuItem,
	PopupOptions,
	SerializableContextMenuItem
} from '../common/context_menus_common'
import { ipcRenderer } from 'electron'

let contextMenuIdPool = 0

export function createContextMenu(
	items: ContextMenuItem[],
	options?: PopupOptions,
	onHide?: () => void
): void {
	const processedItems: ContextMenuItem[] = []

	const contextMenuId = contextMenuIdPool++
	const onClickChannel = `vscode:onContextMenu${contextMenuId}`
	const onClickChannelHandler = (
		event: unknown,
		itemId: number,
		context: ContextMenuEvent
	) => {
		const item = processedItems[itemId]
		item?.click?.(context)
	}

	ipcRenderer.once(onClickChannel, onClickChannelHandler)
	ipcRenderer.once(
		CONTEXT_MENU_CLOSE_CHANNEL,
		(event: unknown, closedContextMenuId: number) => {
			if (closedContextMenuId !== contextMenuId) {
				return
			}

			ipcRenderer.removeListener(onClickChannel, onClickChannelHandler)

			onHide?.()
		}
	)

	ipcRenderer.send(
		CONTEXT_MENU_CHANNEL,
		contextMenuId,
		items.map(item => createItem(item, processedItems)),
		onClickChannel,
		options
	)
}

function createItem(
	item: ContextMenuItem,
	processedItems: ContextMenuItem[]
): SerializableContextMenuItem {
	const serializableItem: SerializableContextMenuItem = {
		id: processedItems.length,
		label: item.label,
		type: item.type,
		accelerator: item.accelerator,
		checked: item.checked,
		enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
		visible: typeof item.visible === 'boolean' ? item.visible : true
	}

	processedItems.push(item)

	// Submenu
	if (Array.isArray(item.submenu)) {
		serializableItem.submenu = item.submenu.map(submenuItem =>
			createItem(submenuItem, processedItems)
		)
	}

	return serializableItem
}
