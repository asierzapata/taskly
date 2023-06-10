import React from 'react'
/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

import { StyleSheet } from 'react-native'
import { Redirect } from 'expo-router'
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
	selectArea,
	selectAreaTasks,
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

const AreaTasksList = ({ areaId }: { areaId: string }) => {
	const tasks = useAppSelector(selectAreaTasks(areaId))
	const area = useAppSelector(selectArea(areaId))
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

	console.log('>>>>>> area tasks list', tasks)
	console.log('>>>>>>', areaId, area)

	const isAreaInbox = areaId === 'inbox'

	const sections = React.useMemo(() => {
		return [
			{
				title: isAreaInbox || !area ? 'Inbox' : area.name,
				data: tasks
			}
		]
	}, [area, isAreaInbox, tasks])

	if (!area && !isAreaInbox) {
		return <Redirect href="/" />
	}

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

export { AreaTasksList }
