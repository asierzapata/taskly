import React from 'react'
/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { StyleSheet } from 'react-native'
/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Box } from '@/ui/box'
import { pixelUnitHorizontal } from '@/ui/normalizer'
import { Text } from '@/ui/text'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { TaskListElement } from '../components/task_list_element'
import {
	completeTask,
	selectTasksWithoutArea,
	uncompleteTask
} from '../task_management_slice'
/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Task } from '../types'

const styles = StyleSheet.create({
	sectionListContainer: {
		paddingHorizontal: pixelUnitHorizontal(4)
	}
})

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const InboxTaskList = () => {
	const tasks = useAppSelector(selectTasksWithoutArea)
	const dispatch = useAppDispatch()

	const handleToggleTaskCompletion = React.useCallback(
		(task: Task) => {
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
		},
		[dispatch]
	)

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
