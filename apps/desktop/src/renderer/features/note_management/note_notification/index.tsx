import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppSelector } from '@renderer/store/hooks'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useToast } from '@taskly/web-ui'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const NoteNotification = () => {
	const notifications = useAppSelector(
		state => state.noteManagement.notifications
	)
	const { toast } = useToast()

	React.useEffect(() => {
		if (notifications.length === 0) {
			return
		}
		const notification = notifications[0]
		if (!notification) {
			return
		}
		toast({
			title: notification.title,
			description: notification.message
		})
	}, [notifications, toast])

	return null
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { NoteNotification }
