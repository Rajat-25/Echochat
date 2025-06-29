import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveChatContactType, WebscoketStateType } from '@repo/types';


const initialState: WebscoketStateType = {
  isConnectionActive: false,
  contactStatus: false,
  isTyping: false,
  error: undefined,
  activeChatContact: undefined,
};

const websocketSlice = createSlice({
  name: 'websocket_slice',
  initialState,
  reducers: {
    setIsConnectionActive: (state, action: PayloadAction<boolean>) => {
      state.isConnectionActive = action.payload;
    },
    setContactStatus: (state, action: PayloadAction<boolean>) => {
      state.contactStatus = action.payload;
    },
    setActiveChatContact: (
      state,
      action: PayloadAction<ActiveChatContactType>
    ) => {
      state.activeChatContact = action.payload;
    },

    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setWebsocketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetSocketSliceState: (state) => {
      state.contactStatus = false;
      state.isTyping = false;
      state.error = undefined;
      state.activeChatContact = undefined;
    },
  },
});

export const {
  resetSocketSliceState,
  setContactStatus,
  setIsTyping,
  setWebsocketError,
  setActiveChatContact,
  setIsConnectionActive,
} = websocketSlice.actions;
export default websocketSlice;
