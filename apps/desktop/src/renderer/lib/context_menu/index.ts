import * as React from 'react'

type UseContextMenuProps = {
	ref: React.RefObject<HTMLElement>
	onContextMenu: (event: MouseEvent) => void
}

export const useContextMenu = ({ ref, onContextMenu }: UseContextMenuProps) => {
	React.useEffect(() => {
		const contextMenuHandler = (event: MouseEvent) => {
			if (ref.current?.contains(event.target as Node)) {
				event.preventDefault()
				event.stopPropagation()
				onContextMenu(event)
			}
		}

		window.addEventListener('contextmenu', contextMenuHandler)

		return () => {
			window.removeEventListener('contextmenu', contextMenuHandler)
		}
	}, [onContextMenu])
}
