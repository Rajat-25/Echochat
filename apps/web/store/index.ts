import { configureStore } from '@reduxjs/toolkit';
import contactSlice from './slices/contactslice';

const store = configureStore({
  reducer: {
    [contactSlice.name]: contactSlice.reducer,
  },
});

export * from './slices/contactslice';
export type RootState = ReturnType<typeof store.getState>;
export default store;
