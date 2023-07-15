export type CommonContextMenuItem = {
	label?: string

	type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio'

	accelerator?: string

	enabled?: boolean
	visible?: boolean
	checked?: boolean
}

export type SerializableContextMenuItem = {
	id: number
	submenu?: SerializableContextMenuItem[]
} & CommonContextMenuItem

export type ContextMenuItem = {
	click?: (event: ContextMenuEvent) => void
	submenu?: ContextMenuItem[]
} & CommonContextMenuItem

export type ContextMenuEvent = {
	shiftKey?: boolean
	ctrlKey?: boolean
	altKey?: boolean
	metaKey?: boolean
}

export type PopupOptions = {
	x?: number
	y?: number
	positioningItem?: number
}

export const CONTEXT_MENU_CHANNEL = 'taskly:contextMenu'
export const CONTEXT_MENU_CLOSE_CHANNEL = 'taskly:onCloseContextMenu'
