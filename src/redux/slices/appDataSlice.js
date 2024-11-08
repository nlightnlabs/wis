import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist';

export const appDataSlice = createSlice({
  name: 'appData',
  initialState: {
    selectedStaffing: [],
    staffData : [],
    showStaff: false,
    totalCost: 0,
    estimatedLOI: 0,
    overallAPH: 0,
    averageAPH: 0,
    totalNumberOfPeople: 0,
    loiPasses: true,
    revenue: 0,
    profit: 0
  },
  reducers: {
    setSelectedStaffing: (state, action) => {
      state.selectedStaffing = action.payload
    },
    setStaffData: (state, action) => {
      state.staffData = action.payload
    },
    setShowStaff: (state, action) => {
      state.showStaff = action.payload
    },
    setTotalCost: (state, action) => {
      state.totalCost = action.payload
    },
    setEstimatedLOI: (state, action) => {
      state.estimatedLOI = action.payload
    },
    setTotalNumberOfPeople: (state, action) => {
      state.totalNumberOfPeople = action.payload
    },
    setOverallAPH: (state, action) => {
      state.overallAPH = action.payload
    },
    setAverageAPH: (state, action) => {
      state.averageAPH = action.payload
    },
    setLOIPasses: (state, action) => {
      state.loiPasses = action.payload
    },
    setProfit: (state, action) => {
      state.profit = action.payload
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      // Reset to initialState when PURGE is triggered
      state.selectedStaffing = [];
      state.staffData = [];
      state.showStaff = false;
      state.totalCost = 0;
      state.estimatedLOI = 0;
      state.overallAPH = 0;
      state.averageAPH = 0;
      state.totalNumberOfPeople = 0;
      state.loiPasses = true;
      state.profit = 0;
      state.revenue = 0;
    });
  },
});

// Action creators are generated for each case reducer function
export const { 
    setSelectedStaffing, 
    setStaffData, 
    setShowStaff, 
    setTotalCost, 
    setEstimatedLOI,
    setTotalNumberOfPeople,
    setOverallAPH,
    setAverageAPH,
    setLOIPasses,
    setProfit,
    setRevenue,
} = appDataSlice.actions

export const clearStorage = () => ({ type: PURGE, key: 'appDataStorage', result: () => null });

export default appDataSlice.reducer