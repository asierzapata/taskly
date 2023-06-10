import React from 'react'
import uuid from 'react-native-uuid'

/* ====================================================== */
/*                   Actions / Selectors                  */
/* ====================================================== */

import { useAppDispatch } from '@/store/hooks'
import { createArea } from '../task_management_slice'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { Box } from '@/ui/box'
import { Button } from '@/ui/button'
import { TextInput } from '@/ui/form/text_input'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import _ from 'lodash'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

type CreateAreaInputProps = {
	onAreaCreated: (areaId: string) => void
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const CreateAreaInput = ({ onAreaCreated }: CreateAreaInputProps) => {
	const dispatch = useAppDispatch()

	const [name, setName] = React.useState('')

	const handleCreateArea = React.useCallback(() => {
		setName('')
		let areaId = uuid.v4()
		areaId = _.isArray(areaId) ? areaId.join('') : areaId
		dispatch(createArea({ id: areaId, name, description: '' }))
		onAreaCreated(areaId)
	}, [dispatch, name, onAreaCreated])

	const handleNameChange = React.useCallback((text: string) => {
		setName(text)
	}, [])

	return (
		<Box backgroundColor="background" flexDirection="column" gap={8}>
			<TextInput
				as={BottomSheetTextInput}
				placeholder="Your area name"
				onChangeText={handleNameChange}
				autoFocus
				autoCorrect
				autoCapitalize="sentences"
			/>
			<Button flavor="primary" onPress={handleCreateArea}>
				Create
			</Button>
		</Box>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { CreateAreaInput }
