import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const envSlice = createSlice({
  name: 'environment',
  initialState: {  
    appName: "Oomnie Labs Prototypes",
    logo: "https://oomnielabs.s3.us-west-2.amazonaws.com/graphics/images/Oomnitza-Logos-RGB_New+Tagline_White+copy.png",
    theme: "oomnielabs-default",
    mode: "dark",
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
      state.appName = "Oomnie Labs Prototypes";
      state.logo = "https://oomnielabs.s3.us-west-2.amazonaws.com/graphics/images/Oomnitza-Logos-RGB_New+Tagline_White+copy.png";
      state.theme = "oomnielabs-default";
      state.mode = "dark";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAppName, setLogoFile, setTheme, setMode} = envSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'envStorage', result: () => null });

export default envSlice.reducer

