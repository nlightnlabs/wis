import { configureStore, combineReducers, applyMiddleWare } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import navReducer from './slices/navSlice';
import appsReducer from './slices/appsSlice';
import envReducer from './slices/envSlice';
import appDataReducer from './slices/appDataSlice'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

// Combine parent and child reducers
const rootReducer = combineReducers({
  authentication: authReducer,
  navigation: navReducer,
  apps: appsReducer,
  environment: envReducer,
  appData:appDataReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
});

// Create the persistor
const persistor = persistStore(store);

// Export both store and persistor
export { store, persistor }; // Ensure this line is included


export const clearAllStorage = () => ({
  type: 'persist/PURGE', // Use 'persist/PURGE' for redux-persist v6
  keys: ['authentication', 'environment', 'navigation', 'apps', 'appData'], // Add keys for all your slices
  result: () => null,
});


export const clearSlices = (sliceKeysArray = []) => (dispatch) => {
  console.log(sliceKeysArray)
  sliceKeysArray.forEach((key) => {
    dispatch({
      type: 'persist/PURGE',
      key,
      result: () => null,
    });
  });
};

