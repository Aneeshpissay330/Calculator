import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from '../storage'; // your MMKV-based storage
import historyReducer from '../features/history'; // your history slice

// Combine reducers (in case you add more later)
const rootReducer = combineReducers({
  history: historyReducer,
});

// Configure persist
const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['history'], // Persist only the history slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
