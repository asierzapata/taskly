import { ObjectId } from 'mongodb'

export const generateDBId = () => {
	return new ObjectId().toHexString()
}
