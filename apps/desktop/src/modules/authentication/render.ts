/**
 * This file contains all the definitions that will be exposed
 * to the render process.
 */
import { ipcRenderer } from 'electron'
import { AuthenticateGenerator } from './authenticate'
import { AuthenticationSuccessGenerator } from './authentication_success'
import { NAME } from './module'

const methods = () => ({
	...AuthenticateGenerator.render(ipcRenderer),
	...AuthenticationSuccessGenerator.render(ipcRenderer)
})

export { NAME, methods }
