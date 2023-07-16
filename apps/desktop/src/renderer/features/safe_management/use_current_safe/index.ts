import { useAppSelector } from '@renderer/store/hooks'

export const useCurrentSafe = () => {
	const currentSafe = useAppSelector(state =>
		state.safeManagement.currentSafeId
			? state.safeManagement.safes[state.safeManagement.currentSafeId]
			: null
	)

	return currentSafe
}
