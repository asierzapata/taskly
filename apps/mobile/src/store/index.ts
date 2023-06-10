import { calendarManagementReducer } from '@/features/calendar_management/calendar_management_slice'
import { taskManagementReducer } from '@/features/task_management/task_management_slice'
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
import expoFileSystemStorage from 'redux-persist-expo-filesystem'

const rootReducer = combineReducers({
	taskManagement: taskManagementReducer,
	calendarManagement: calendarManagementReducer
})

const persistConfig = {
	key: 'root',
	storage: expoFileSystemStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	devTools: __DEV__,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
