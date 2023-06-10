import React from 'react'
/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@/store/hooks'
/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { Button } from '@/ui/button'
import { TextInput } from '@/ui/form/text_input'
import { Icon } from '@/ui/icon'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { SendIcon } from 'lucide-react-native'

import { createAreaTask } from '../task_management_slice'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

type AddTaskInputProps = {
	areaId: string
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const AddTaskInput = ({ areaId }: AddTaskInputProps) => {
	const dispatch = useAppDispatch()

	const [title, setTitle] = React.useState('')

	const handleAddTask = React.useCallback(() => {
		setTitle('')
		dispatch(createAreaTask({ title, description: '', areaId }))
	}, [areaId, dispatch, title])

	const handleTitleChange = React.useCallback((text: string) => {
		setTitle(text)
	}, [])

	return (
		<Box
			flex={1}
			backgroundColor="background"
			flexDirection="row"
			pv={4}
			ph={4}
			gap={4}
		>
			<TextInput
				as={BottomSheetTextInput}
				flex={1}
				placeholder="Add task..."
				value={title}
				onChangeText={handleTitleChange}
			/>
			<Button flavor="text" onPress={handleAddTask}>
				<Icon icon={SendIcon} size={16} />
			</Button>
		</Box>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { AddTaskInput }
