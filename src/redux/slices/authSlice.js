import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    user: null,
    isAuthenticated: false
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      // Reset to initialState when PURGE is triggered
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setIsAuthenticated } = authSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'authStorage', result: () => null });

export default authSlice.reducer
