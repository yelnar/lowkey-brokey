import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { brokeySlice } from './brokey/slice'
import { userSlice } from './user/slice'
import {
  dependencies as appDependencies,
  AppDependencies,
} from './dependencies'

const rootReducer = combineReducers({
  brokey: brokeySlice.reducer,
  user: userSlice.reducer,
})

export const createStore = (dependencies?: Partial<AppDependencies>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { ...appDependencies, ...dependencies },
        },
      }),
  })

export type Store = ReturnType<typeof createStore>
export type AppState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   AppState,
//   unknown,
//   Action<string>
// >;
export type AppThunk = (
  dispatch: AppDispatch,
  getState: () => AppState,
  dependencies: AppDependencies
) => void | Promise<void>
