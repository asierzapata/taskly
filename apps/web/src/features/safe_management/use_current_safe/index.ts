import { useSafeManagementStore } from '../safe_management_slice'

export const useCurrentSafe = () => {
	const currentSafeId = useSafeManagementStore.use.currentSafeId
		? useSafeManagementStore.use.currentSafeId()
		: ''

	if (!currentSafeId) {
		return null
	}

	const currentSafe = useSafeManagementStore.use.safes()[currentSafeId]

	return currentSafe
}
