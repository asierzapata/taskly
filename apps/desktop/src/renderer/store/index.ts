import { combineReducers, configureStore } from '@reduxjs/toolkit'

import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE
} from 'redux-persist'
// import createElectronStorage from 'redux-persist-electron-storage'
import storage from 'redux-persist/lib/storage'

import { noteManagementReducer } from '@renderer/features/note_management/note_management_slice'
import { safeManagementReducer } from '@renderer/features/safe_management/safe_management_slice'

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['noteManagement']
	// storage: createElectronStorage({
	// 	electronStoreOpts: {
	// 		encryptionKey: 'G%59tpd!zUy8Kc!b7EHxta+-w4W!b22r'
	// 	}
	// })
}

const rootReducer = combineReducers({
	noteManagement: noteManagementReducer,
	safeManagement: safeManagementReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	// TODO: Change this for correct boolean
	devTools: true,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			},
			thunk: {
				extraArgument: {
					// Inject a set of useful utilities for the renderer process
					// to use in the Redux actions
					windowApi: window.api
				}
			}
		})
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
