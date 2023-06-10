import * as React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Timeline } from '@/features/calendar_management/timeline'
import { AreasList } from '@/features/task_management/areas_list'
import type { Area } from '@/features/task_management/types'
import { Box } from '@/ui/box'
import { Button } from '@/ui/button'
import { colors } from '@/ui/colors'
import BottomSheet from '@gorhom/bottom-sheet'
import { PlusIcon } from 'lucide-react-native'

export default function Index() {
	const router = useRouter()

	const colorScheme = useColorScheme() ?? 'light'

	const bottomSheetRef = React.useRef<BottomSheet>(null)

	const snapPoints = React.useMemo(() => ['10%', '50%'], [])

	const handleSheetChanges = React.useCallback((index: number) => {
		console.log('handleSheetChanges', index)
	}, [])

	const handleAreaPressed = React.useCallback(
		(area: Area) => {
			router.push(`/area/${area.id}`)
		},
		[router]
	)

	const handleInboxPressed = React.useCallback(() => {
		router.push(`/inbox`)
	}, [router])

	const handleAddArea = React.useCallback(() => {
		router.push(`/add-area`)
	}, [router])

	return (
		<Box flex={1} justifyContent="center" alignItems="center">
			<Box width="100%" height="100%">
				<Timeline />
			</Box>
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={styles.sheetContainer}
				handleIndicatorStyle={
					colorScheme === 'light'
						? styles.lightBottomSheetHandler
						: styles.darkBottomSheetHandler
				}
				backgroundStyle={
					colorScheme === 'light'
						? styles.lightBottomSheet
						: styles.darkBottomSheet
				}
			>
				<Box width="100%" align="flex-end" justify="center" ph={4} pb={4}>
					<Button
						flavor="text"
						onPress={handleAddArea}
						icon={PlusIcon}
						iconSide="left"
						iconColor="secondary"
					>
						Add Area
					</Button>
				</Box>
				<AreasList
					onAreaPressed={handleAreaPressed}
					onInboxPressed={handleInboxPressed}
				/>
			</BottomSheet>
		</Box>
	)
}

const styles = StyleSheet.create({
	darkBottomSheetHandler: {
		backgroundColor: colors.dark.text
	},
	darkBottomSheet: {
		backgroundColor: colors.dark.background
	},
	lightBottomSheet: {
		backgroundColor: colors.light.background
	},
	lightBottomSheetHandler: {
		backgroundColor: colors.light.text
	},
	sheetContainer: {
		borderTopStartRadius: 24,
		borderTopEndRadius: 24,
		shadowOffset: {
			width: 0,
			height: 12
		},
		shadowOpacity: 0.75,
		shadowRadius: 16.0,

		elevation: 24
	}
})
