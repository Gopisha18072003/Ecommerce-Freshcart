import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  modal: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
      state.modal = 'Login Successfully!'
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = {...state.currentUser, ...action.payload}
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.data;
      state.modal = action.payload.error ||  'Invalid Username or Password'
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      state.modal = state.modal || 'Logout Successfully!'
    },
    setModalStore: (state, action) => {
      state.modal = action.payload
    },
    clearModal: (state) => {
      state.modal = null
    }
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  clearModal,
  updateCurrentUser,
  setModalStore
} = userSlice.actions;

export default userSlice.reducer;