import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const envSlice = createSlice({
  name: 'environment',
  initialState: {  
    appName: "AI Event Staffing Optimizer",
    logo: "",
    theme: "",
    mode: "light",
  },
  reducers: {
    setAppName: (state, action) => {
      state.appName = action.payload
    },
    setLogo: (state, action) => {
      state.logoFile = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setMode: (state, action) => {
      state.mode = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      // Reset to initialState when PURGE is triggered
      state.appName = "AI Event Staffing Optimizer";
      state.logo = "";
      state.theme = "";
      state.mode = "light";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAppName, setLogoFile, setTheme, setMode} = envSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'envStorage', result: () => null });

export default envSlice.reducer

