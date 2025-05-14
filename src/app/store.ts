import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from '../storage'; // your MMKV-based storage
import historyReducer from '../features/history'; // your history slice
import themeReducer from '../features/theme';   // your theme slice

// Combine reducers (in case you add more later)
const rootReducer = combineReducers({
  history: historyReducer,
  theme: themeReducer,
});

// Configure persist
const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['history', 'theme'], // Persist both history and theme slices
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
