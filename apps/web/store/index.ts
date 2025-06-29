import { configureStore } from '@reduxjs/toolkit';
import contactSlice from './slices/contactslice';
import chatSlice from './slices/chatSlice';
import websocketSlice from './slices/websocketSlice';
import { websocketMiddleware } from './middleware/websocketMiddleware';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    [contactSlice.name]: contactSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [websocketSlice.name]: websocketSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(websocketMiddleware)
});

export * from './slices/chatSlice';
export * from './slices/userSlice';
export * from './slices/contactslice';
export * from './slices/websocketSlice';

export type RootState = ReturnType<typeof store.getState>;
export default store;
