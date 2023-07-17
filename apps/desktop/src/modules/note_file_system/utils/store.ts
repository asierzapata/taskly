import ElectronStore from 'electron-store'
import { app } from 'electron'
import * as path from 'path'

console.log('>>>>>>', 'renderer store')

type Store = {
	currentSafePath: string
}

export const store = new ElectronStore<Store>({
	defaults: {
		currentSafePath: path.join(app.getPath('userData'), 'notes')
	}
})

export type StoreType = ElectronStore<Store>
