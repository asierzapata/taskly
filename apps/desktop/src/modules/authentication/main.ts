import { supabase } from '@services/supabase'
import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron/main'

import { NAME } from './module'

import { AuthenticateGenerator } from './authenticate'
import { AuthenticateMagicLinkGenerator } from './authenticate_magiclink'
import { GetSessionGenerator } from './get_session'
import { AuthenticationStateChangedGenerator } from './authentication_state_changed'

const dependencies = {
	supabase
}

const methods = (window: BrowserWindow) => ({
	...GetSessionGenerator.main(ipcMain, dependencies),
	...AuthenticateGenerator.main(ipcMain, dependencies),
	...AuthenticateMagicLinkGenerator.main(window, dependencies),
	...AuthenticationStateChangedGenerator.main(window, dependencies)
})

export { NAME, methods }
