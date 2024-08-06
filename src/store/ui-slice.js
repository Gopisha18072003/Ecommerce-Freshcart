import { createSlice } from "@reduxjs/toolkit";

const ui = createSlice({
    name: 'ui',
    initialState: {filters: {}, sortBy: ''},
    reducers: {
        addFilter(state, action) {
            state.filters= action.payload
        },
        removeFilter(state) {
            state.filters = {}
        },
        addSortBy(state, action) {
            state.sortBy = action.payload
        }
    }
})
export const {
    addFilter,
    removeFilter,
    addSortBy
} = ui.actions;
  
export default ui.reducer;