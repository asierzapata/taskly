import React from 'react'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	completeTask,
	selectTasksWithoutArea,
	uncompleteTask
} from '../task_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { TaskListElement } from '../components/task_list_element'
import { Text } from '@/ui/text'
import { Box } from '@/ui/box'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { StyleSheet } from 'react-native'
import { pixelUnitHorizontal } from '@/ui/normalizer'

const styles = StyleSheet.create({
	sectionListContainer: {
		paddingHorizontal: pixelUnitHorizontal(4)
	}
})

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Task } from '../types'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const InboxTaskList = () => {
	const tasks = useAppSelector(selectTasksWithoutArea)
	const dispatch = useAppDispatch()

	const handleToggleTaskCompletion = React.useCallback((task: Task) => {
		if (!task.completedAt) {
			return dispatch(
				completeTask({
					id: task.id
				})
			)
		}
		dispatch(
			uncompleteTask({
				id: task.id
			})
		)
	}, [])

	const sections = React.useMemo(() => {
		return [
			{
				title: 'Inbox',
				data: tasks
			}
		]
	}, [tasks])

	return (
		<BottomSheetSectionList
			sections={sections}
			renderItem={({ item }) => (
				<TaskListElement
					task={item}
					onToggleTaskCompletion={handleToggleTaskCompletion}
				/>
			)}
			renderSectionHeader={({ section }) => (
				<Box mv={4} backgroundColor="background">
					<Text size="bigBody" weight="bold">
						{section.title}
					</Text>
				</Box>
			)}
			keyExtractor={item => item.id}
			contentContainerStyle={styles.sectionListContainer}
		/>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { InboxTaskList }
