import { useSafeManagementStore } from '../safe_management_slice'

export const useCurrentSafe = () => {
	const currentSafeId = useSafeManagementStore.use.currentSafeId
		? useSafeManagementStore.use.currentSafeId()
		: null

	if (!currentSafeId) {
		return
	}

	const currentSafe = useSafeManagementStore.use.safes()[currentSafeId]

	return currentSafe
}
