import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducer so the store has a valid reducer map before any feature
// slices exist (configureStore throws on an empty `reducer` object). Remove
// this entry once the first real feature slice is added below.
const placeholderReducer = (state: Record<string, never> = {}) => state;

export const makeStore = () => {
  return configureStore({
    reducer: {
      placeholder: placeholderReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
