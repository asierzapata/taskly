import * as React from 'react'

import { Box } from '@/ui/box'
import { StyleSheet, useColorScheme } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { colors } from '@/ui/colors'
import { useRouter } from 'expo-router'
import { Button } from '@/ui/button'
import { CreateAreaInput } from '@/features/task_management/create_area_input'
import { ChevronLeftIcon } from 'lucide-react-native'
import { Area } from '@/features/task_management/types'

export default function Index() {
	const router = useRouter()

	const colorScheme = useColorScheme() ?? 'light'

	const bottomSheetRef = React.useRef<BottomSheet>(null)

	const snapPoints = React.useMemo(() => ['10%', '50%'], [])

	const handleSheetChanges = React.useCallback((index: number) => {
		console.log('handleSheetChanges', index)
	}, [])

	const handleGoBack = React.useCallback(() => {
		router.push('/')
	}, [])

	const handleAreaCreated = React.useCallback((areaId: string) => {
		router.push(`/area/${areaId}`)
	}, [])

	return (
		<Box flex={1} justifyContent="center" alignItems="center">
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
				<Box
					width="100%"
					flexDirection="row"
					align="center"
					justify="flex-start"
					mh={4}
				>
					<Button
						flavor="text"
						onPress={handleGoBack}
						icon={ChevronLeftIcon}
						iconColor="text"
					>
						Go Back
					</Button>
				</Box>
				<Box mh={4} mv={8}>
					<CreateAreaInput onAreaCreated={handleAreaCreated} />
				</Box>
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
