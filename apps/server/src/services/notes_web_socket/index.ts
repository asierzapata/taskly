import { HTTPServer } from '../http_server/http_server'
import WebSocket from 'ws'
import * as Y from 'yjs'
import { MongodbPersistence } from 'y-mongodb-provider'
import yUtils from 'y-websocket/bin/utils'
import { env as _env } from '../../env'
import { Request } from 'express'
import { ApplicationError } from '@server/utils/application_error'
import internal from 'stream'

class NotesWebSocket {
	route: string
	server: HTTPServer
	wss: WebSocket.Server
	mongoDbPersistence: MongodbPersistence

	constructor({
		route,
		server,
		env
	}: {
		route: string
		server: HTTPServer
		env: typeof _env
	}) {
		this.route = route
		this.server = server
		this.wss = new WebSocket.Server({
			noServer: true
		})
		this.mongoDbPersistence = new MongodbPersistence(env.MONGODB_URI, {
			collectionName: 'notes',
			flushSize: 100
		})
	}

	async start() {
		this.wss.on('connection', yUtils.setupWSConnection)
		this.server.on(
			'upgrade',
			async (request, socket: internal.Duplex, head) => {
				if (request.url.startsWith('/notes')) {
					try {
						await this.authenticateRequest(request)
					} catch (error) {
						socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
						socket.destroy()
					}
					this.wss.handleUpgrade(
						request,
						socket,
						head,
						async (ws: WebSocket) => {
							this.wss.emit('connection', ws, request)
						}
					)
					return
				}

				socket.destroy()
			}
		)

		yUtils.setPersistence({
			bindState: async (docName: string, ydoc: Y.Doc) => {
				// Here you listen to granular document updates and store them in the database
				// You don't have to do this, but it ensures that you don't lose content when the server crashes
				// See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
				// document updates

				// official default code from: https://github.com/yjs/y-websocket/blob/37887badc1f00326855a29fc6b9197745866c3aa/bin/utils.js#L36
				const persistedYdoc = await this.mongoDbPersistence.getYDoc(docName)
				const newUpdates = Y.encodeStateAsUpdate(ydoc)
				this.mongoDbPersistence.storeUpdate(docName, newUpdates)
				Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
				ydoc.on('update', async update => {
					this.mongoDbPersistence.storeUpdate(docName, update)
				})
			},
			writeState: async (docName: string, ydoc: Y.Doc) => {
				// This is called when all connections to the document are closed.
				const persistedYdoc = await this.mongoDbPersistence.getYDoc(docName)
				const newUpdates = Y.encodeStateAsUpdate(ydoc)
				this.mongoDbPersistence.storeUpdate(docName, newUpdates)
				Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
			}
		})
	}

	// TODO: check authentication to see if user is allowed to access this document
	async authenticateRequest(request: Request) {
		if (!request.session) {
			throw ApplicationError.Operational({
				errorName: 'taskly.1.error.authentication.invalid_session',
				message: 'Invalid session',
				code: 'invalid-session'
			})
		}
		if (!request.session.isAuthenticated()) {
			throw ApplicationError.Operational({
				errorName: 'taskly.1.error.authentication.unauthenticated',
				message: 'Unauthenticated',
				code: 'unauthenticated'
			})
		}
		// TODO: Check that user is allowed to access this note
		return
	}
}

export { NotesWebSocket }
