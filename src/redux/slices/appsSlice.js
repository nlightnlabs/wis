import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const appsSlice = createSlice({
  name: 'apps',
  initialState: {
    apps: [],
    currentApp: null,
  },
  reducers: {
    setApps: (state,action) => {
      state.apps = action.payload
    },
    setCurrentApp: (state,action) => {
      state.currentApp = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      // Reset to initialState when PURGE is triggered
      state.apps = [];
      state.currentApp = null;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setApps, setCurrentApp } = appsSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'apps', result: () => null });

export default appsSlice.reducer