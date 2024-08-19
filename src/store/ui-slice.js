import { createSlice } from "@reduxjs/toolkit";

const ui = createSlice({
    name: 'ui',
    initialState: {filters: {}, sortBy: '', isProfileUploading: false},
    reducers: {
        addFilter(state, action) {
            state.filters= action.payload
        },
        removeFilter(state) {
            state.filters = {}
        },
        addSortBy(state, action) {
            state.sortBy = action.payload
        },
        setIsProfileUploading(state, action) {
            state.isProfileUploading = action.payload
        },

    }
})
export const {
    addFilter,
    removeFilter,
    addSortBy,
    setIsProfileUploading
} = ui.actions;
  
export default ui.reducer;