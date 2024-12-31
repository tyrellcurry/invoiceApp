import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

interface darkmodeState {
  darkmode: boolean;
}

const initialState: darkmodeState = {
  darkmode: false,
};

export const darkmodeSlice = createSlice({
  name: 'darkmode',
  initialState,
  reducers: {
    setDarkmode: (state, action: PayloadAction<boolean>) => {
      state.darkmode = action.payload;
    },
    toggleDarkMode(state) {
      state.darkmode = !state.darkmode;
    },
  },
});

export const { setDarkmode, toggleDarkMode } = darkmodeSlice.actions;
export const selectDarkmode = (state: RootState) => state.darkmode.darkmode;
export default darkmodeSlice.reducer;
