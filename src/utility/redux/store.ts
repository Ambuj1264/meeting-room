import { configureStore } from '@reduxjs/toolkit';
import counterReducer from "./slices/feature/counter";
import authSlice  from './slices/feature/auth';
// import postReducer from "./slices/features/postSlices";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;