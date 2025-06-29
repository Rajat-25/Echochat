import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ContactSliceStateType,
  EditContactType,
  UserContactListType,
} from '@repo/types';

const initialState: ContactSliceStateType = {
  selectedContact: null,
  userContacts: {},
};

const contactSlice = createSlice({
  name: 'contact_slice',
  initialState,
  reducers: {
    setUserContacts: (
      state,
      action: PayloadAction<Record<string, UserContactListType>>
    ) => {
      state.userContacts = action.payload;
    },
    selectEditContact: (state, action: PayloadAction<EditContactType>) => {
      state.selectedContact = action.payload;
    },
    clearContactSliceState: (state) => {
      state.selectedContact = null;
      state.userContacts = {};
    },
    clearEditContact: (state) => {
      state.selectedContact = null;
    },
  },
});

export const {
  selectEditContact,
  clearEditContact,
  clearContactSliceState,
  setUserContacts,
} = contactSlice.actions;
export default contactSlice;
