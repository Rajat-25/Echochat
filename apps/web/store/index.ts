import { configureStore } from '@reduxjs/toolkit';
import { websocketMiddleware } from './middleware/websocketMiddleware';
import chatSlice from './slices/chatSlice';
import contactSlice from './slices/contactslice';
import userSlice from './slices/userSlice';
import websocketSlice from './slices/websocketSlice';
import userApi from './api/userApi';
import contactApi from './api/contactApi';

const store = configureStore({
  reducer: {
    [contactSlice.name]: contactSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [websocketSlice.name]: websocketSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(websocketMiddleware)
      .concat(userApi.middleware)
      .concat(contactApi.middleware),
});

export * from './slices/chatSlice';
export * from './slices/contactslice';
export * from './slices/userSlice';
export * from './slices/websocketSlice';
export * from './api/userApi';
export * from './api/contactApi';

export type RootState = ReturnType<typeof store.getState>;
export default store;
