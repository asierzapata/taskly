import uuid from 'react-native-uuid'
import type { RootState } from '@/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'

import type { Areas, Tasks } from './types'

type TaskManagementState = {
	tasks: Tasks
	areas: Areas
}

const initialState: TaskManagementState = {
	tasks: [],
	areas: []
}

export const taskManagement = createSlice({
	name: 'taskManagement',
	initialState,
	reducers: {
		createArea: (
			state,
			action: PayloadAction<{ name: string; description: string; id: string }>
		) => {
			const { id, name, description } = action.payload
			console.log('>>>>>> id, name, description', id, name, description)
			console.log('>>>>>> state.areas', state.areas)
			state.areas = [
				...state.areas,
				{
					id,
					name,
					description,
					numberOfTasks: 0,
					createdAt: Date.now(),
					updatedAt: Date.now()
				}
			]
		},
		updateAreaName: (
			state,
			action: PayloadAction<{ id: string; name: string }>
		) => {
			const { id, name } = action.payload
			const area = _.first(_.filter(state.areas, area => area.id === id))
			if (!area) return
			state.areas = [
				..._.filter(state.areas, area => area.id !== id),
				{
					...area,
					name,
					updatedAt: Date.now()
				}
			]
		},
		moveTaskToArea: (
			state,
			action: PayloadAction<{ taskId: string; areaId: string }>
		) => {
			const { taskId, areaId } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === taskId))
			if (!task) return
			state.tasks = [
				..._.filter(state.tasks, task => task.id !== taskId),
				{
					...task,
					areaId,
					updatedAt: Date.now()
				}
			]
		},
		createTask: (
			state,
			action: PayloadAction<{ title: string; description: string }>
		) => {
			let id = uuid.v4()
			id = _.isArray(id) ? id.join('') : id
			const { title, description } = action.payload
			state.tasks = [
				...state.tasks,
				{
					id,
					title,
					description,
					areaId: '',
					createdAt: Date.now(),
					updatedAt: Date.now()
				}
			]
		},
		createAreaTask: (
			state,
			action: PayloadAction<{
				areaId: string
				title: string
				description: string
			}>
		) => {
			let id = uuid.v4()
			id = _.isArray(id) ? id.join('') : id
			const { areaId, title, description } = action.payload
			state.tasks = [
				...state.tasks,
				{
					id,
					title,
					description,
					areaId,
					createdAt: Date.now(),
					updatedAt: Date.now()
				}
			]
		},
		updateTaskTitle: (
			state,
			action: PayloadAction<{ id: string; title: string }>
		) => {
			const { id, title } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === id))
			if (!task) return
			state.tasks = [
				..._.filter(state.tasks, task => task.id !== id),
				{
					...task,
					title,
					updatedAt: Date.now()
				}
			]
		},
		updateTaskDescription: (
			state,
			action: PayloadAction<{ id: string; description: string }>
		) => {
			const { id, description } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === id))
			if (!task) return
			state.tasks = [
				..._.filter(state.tasks, task => task.id !== id),
				{
					...task,
					description,
					updatedAt: Date.now()
				}
			]
		},
		completeTask: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === id))
			if (!task) return
			state.tasks = [
				..._.filter(state.tasks, task => task.id !== id),
				{
					...task,
					completedAt: Date.now(),
					updatedAt: Date.now()
				}
			]
		},
		uncompleteTask: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === id))
			if (!task) return
			state.tasks = [
				..._.filter(state.tasks, task => task.id !== id),
				{
					...task,
					completedAt: undefined,
					updatedAt: Date.now()
				}
			]
		},
		deleteTask: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const task = _.first(_.filter(state.tasks, task => task.id === id))
			if (!task) return
			state.tasks = _.filter(state.tasks, task => task.id !== id)
		}
	}
})

// Actions
// -------

export const {
	createArea,
	createTask,
	createAreaTask,
	moveTaskToArea,
	updateAreaName,
	updateTaskTitle,
	updateTaskDescription,
	completeTask,
	uncompleteTask,
	deleteTask
} = taskManagement.actions

// Reducer
// -------

export const taskManagementReducer = taskManagement.reducer

// Selectors
// ---------

export const selectAreas = (state: RootState) =>
	_.orderBy(state.taskManagement.areas, 'createdAt', 'asc').map(area => ({
		...area,
		numberOfTasks: _.filter(
			state.taskManagement.tasks,
			task => task.areaId === area.id
		).length
	}))

export const selectArea = (id: string) => (state: RootState) =>
	_.first(_.filter(state.taskManagement.areas, area => area.id === id))

export const selectTasksWithoutArea = (state: RootState) =>
	_.orderBy(
		_.filter(state.taskManagement.tasks, task => _.isEmpty(task.areaId)),
		'createdAt',
		'asc'
	)

export const selectAllTasks = (state: RootState) =>
	_.orderBy(state.taskManagement.tasks, 'createdAt', 'asc')

export const selectAreaTasks = (areaId: string) => (state: RootState) =>
	_.orderBy(
		_.filter(state.taskManagement.tasks, task => task.areaId === areaId),
		'createdAt',
		'asc'
	)

export const selectTask = (id: string) => (state: RootState) =>
	_.first(_.filter(state.taskManagement.tasks, task => task.id === id))
