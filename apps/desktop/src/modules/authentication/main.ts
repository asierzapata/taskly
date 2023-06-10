import { supabase } from '@/supabase'
import { BrowserWindow, ipcMain } from 'electron'
import { AuthenticateGenerator } from './authenticate'
import { AuthenticationSuccessGenerator } from './authentication_success'
import { NAME } from './module'

const methods = (window: BrowserWindow) => ({
	...AuthenticateGenerator.main(ipcMain, {
		supabase
	}),
	...AuthenticationSuccessGenerator.main(window)
})

export { NAME, methods }
