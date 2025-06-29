import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AllChatType,
  ChatSliceStateType,
  ChatType
} from '@repo/types';

const initialState: ChatSliceStateType = {
  currentChat: [],
  allChats: {},
};

const chatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setAllChats: (
      state,
      action: PayloadAction<Record<string, AllChatType>>
    ) => {
      state.allChats = action.payload;
    },
    updateAllChatsData: (
      state,
      action: PayloadAction<Record<string, AllChatType>>
    ) => {
      state.allChats = {
        ...state.allChats,
        ...action.payload,
      };
    },

    updateCurrentChat: (state, action: PayloadAction<ChatType>) => {
      state.currentChat = [...state.currentChat, action.payload];
    },
    setCurrentChat: (state, action: PayloadAction<ChatType[]>) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = [];
    },
  },
});

export const {
  clearCurrentChat,
  updateCurrentChat,
  updateAllChatsData,
  setAllChats,
  setCurrentChat,
} = chatSlice.actions;
export default chatSlice;
