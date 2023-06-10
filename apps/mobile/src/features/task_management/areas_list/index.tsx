import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppSelector } from '@/store/hooks'
import { selectAreas, selectTasksWithoutArea } from '../task_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { InboxIcon, DatabaseIcon } from 'lucide-react-native'
import { Text } from '@/ui/text'
import { Icon } from '@/ui/icon'
import { Box } from '@/ui/box'
import { Pressable } from 'react-native'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Area } from '../types'
import type { LucideIcon } from 'lucide-react-native'

type AreasListProps = {
	onAreaPressed: (area: Area) => void
	onInboxPressed: () => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const AreasList = ({ onAreaPressed, onInboxPressed }: AreasListProps) => {
	const areas = useAppSelector(selectAreas)
	const inboxTasks = useAppSelector(selectTasksWithoutArea)

	console.log('>>>>>> areas list', areas)

	const handleAreaPressed = React.useCallback(
		(areaId: string) => {
			if (areaId === 'inbox') {
				return onInboxPressed()
			}

			const area = areas.find(area => area.id === areaId)
			if (!area) {
				return
			}

			onAreaPressed(area)
		},
		[onAreaPressed]
	)

	const areaItems = React.useMemo(() => {
		return [
			{
				id: 'inbox',
				name: 'Inbox',
				numberOfTasks: inboxTasks.length,
				icon: InboxIcon
			},
			...areas.map(area => ({
				id: area.id,
				name: area.name,
				numberOfTasks: area.numberOfTasks
			}))
		]
	}, [areas])

	return (
		<BottomSheetFlatList
			data={areaItems}
			renderItem={({ item }) => (
				<AreaCard
					key={item.id}
					name={item.name}
					numberOfTasks={item.numberOfTasks}
					onAreaPressed={() => handleAreaPressed(item.id)}
				/>
			)}
			keyExtractor={item => item.id}
			numColumns={2}
			columnWrapperStyle={{
				justifyContent: 'space-between'
			}}
		/>
	)
}

const AreaCard = ({
	name,
	numberOfTasks,
	onAreaPressed,
	icon
}: {
	name: string
	numberOfTasks: number
	onAreaPressed: () => void
	icon?: LucideIcon
}) => {
	return (
		<Box flex={1} pv={2} ph={2}>
			<Box
				as={Pressable}
				onPress={onAreaPressed}
				pv={4}
				ph={4}
				flexDirection="column"
				alignItems="flex-start"
				backgroundColor="backgroundLight"
				borderRadius={4}
				gap={2}
			>
				<Box
					flexDirection="row"
					align="center"
					justify="space-between"
					width="100%"
				>
					<Icon icon={icon || DatabaseIcon} color="secondary" size={24} />
					<Text weight="bold">{numberOfTasks}</Text>
				</Box>
				<Text weight="bold">{name}</Text>
			</Box>
		</Box>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AreasList }
