// Add here other modules
import * as AuthenticationModule from '@modules/authentication/render'

export const API = {
	[AuthenticationModule.NAME]: AuthenticationModule.methods()
}
