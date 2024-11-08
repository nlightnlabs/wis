import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const navSlice = createSlice({
  name: 'navigation',
  initialState: {
    pages: ["event_staffing", "store_trends"],
    currentPage: "event_staffing",
  },
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      // Reset to initialState when PURGE is triggered
      state.pages = [];
      state.currentPage = "event_staffing";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPage, setcurrentApp, setPageList, setMenuItems} = navSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'navStorage', result: () => null });

export default navSlice.reducer