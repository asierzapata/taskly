import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Pressable } from 'react-native'
import { Text } from '@/ui/text'
import { Box } from '@/ui/box'
import Checkbox from 'expo-checkbox'
import SwipeableItem from 'react-native-swipeable-item'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Task } from '../../types'

type TaskListElementProps = {
	task: Task
	onToggleTaskCompletion: (task: Task) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const TaskListElement = ({
	task,
	onToggleTaskCompletion
}: TaskListElementProps) => {
	console.log('>>>>>> TaskListElement', task)
	const [isExpanded, setIsExpanded] = React.useState(false)

	const handleToggleTaskCompletion = React.useCallback(() => {
		onToggleTaskCompletion(task)
	}, [task, onToggleTaskCompletion])

	const handleToggleExpanded = React.useCallback(() => {
		setIsExpanded(_isExpanded => !_isExpanded)
	}, [])

	return (
		<SwipeableItem
			key={task.id}
			item={task}
			renderUnderlayLeft={() => <Text>Hi</Text>}
			renderUnderlayRight={() => <Text>Bye</Text>}
			snapPointsLeft={[150]}
		>
			<Box
				as={Pressable}
				backgroundColor="backgroundLight"
				flexDirection="column"
				gap={2}
				ph={2}
				pv={2}
				mv={1}
				borderRadius={4}
				onPress={handleToggleExpanded}
			>
				<Box flex={1} flexDirection="row" gap={2}>
					<Checkbox
						value={!!task.completedAt}
						onValueChange={handleToggleTaskCompletion}
					/>
					<Text>{task.title}</Text>
				</Box>
				{isExpanded && (
					<Box flex={1} flexDirection="row">
						<Text>
							{task.description ||
								'Test description of a task to see how much text can I show'}
						</Text>
					</Box>
				)}
			</Box>
		</SwipeableItem>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { TaskListElement }
