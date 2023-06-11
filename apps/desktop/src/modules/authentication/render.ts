/**
 * This file contains all the definitions that will be exposed
 * to the render process.
 */
import { ipcRenderer } from 'electron'

import { NAME } from './module'

import { AuthenticateGenerator } from './authenticate'
import { AuthenticateMagicLinkGenerator } from './authenticate_magiclink'
import { GetSessionGenerator } from './get_session'
import { AuthenticationStateChangedGenerator } from './authentication_state_changed'

const methods = () => ({
	...GetSessionGenerator.render(ipcRenderer),
	...AuthenticateGenerator.render(ipcRenderer),
	...AuthenticateMagicLinkGenerator.render(ipcRenderer),
	...AuthenticationStateChangedGenerator.render(ipcRenderer)
})

export { NAME, methods }
