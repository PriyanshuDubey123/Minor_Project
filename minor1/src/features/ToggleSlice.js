import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

export const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    openSidebar: (state) => {
      state.isOpen = true;
    },
  },
});

export const { toggleSidebar, closeSidebar, openSidebar } = toggleSlice.actions;

export const selectToggle = (state) => state.toggle.isOpen;

export default toggleSlice.reducer;
