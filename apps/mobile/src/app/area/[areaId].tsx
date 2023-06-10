import * as React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { AddTaskInput } from '@/features/task_management/add_task_input'
import { AreaTasksList } from '@/features/task_management/area_tasks_list'
import { Box } from '@/ui/box'
import { Button } from '@/ui/button'
import { colors } from '@/ui/colors'
import BottomSheet, {
	BottomSheetFooter,
	type BottomSheetFooterProps
} from '@gorhom/bottom-sheet'
import { ChevronLeftIcon } from 'lucide-react-native'

export default function Index() {
	const { areaId } = useLocalSearchParams<{ areaId: string }>()

	const router = useRouter()

	const colorScheme = useColorScheme() ?? 'light'

	const bottomSheetRef = React.useRef<BottomSheet>(null)

	const snapPoints = React.useMemo(() => ['10%', '50%'], [])

	const handleSheetChanges = React.useCallback((index: number) => {
		console.log('handleSheetChanges', index)
	}, [])

	const handleGoBack = React.useCallback(() => {
		router.push('/')
	}, [router])

	const renderFooter = React.useCallback(
		(props: BottomSheetFooterProps) => (
			<BottomSheetFooter {...props}>
				{areaId && <AddTaskInput areaId={areaId} />}
			</BottomSheetFooter>
		),
		[areaId]
	)

	if (!areaId) {
		return <Redirect href="/" />
	}

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
				footerComponent={renderFooter}
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
				<AreaTasksList areaId={areaId} />
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
