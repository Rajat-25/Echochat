import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactSchemaType } from '@repo/types';

type ContactState = {
  selectedContact?: ContactSchemaType & { id: number };
};

const initialState: ContactState = {
  selectedContact: undefined,
};

const contactSlice = createSlice({
  name: 'contact_slice',
  initialState,
  reducers: {
    selectEditContact: (
      state,
      action: PayloadAction<ContactState['selectedContact']>
    ) => {
      state.selectedContact = action.payload;
    },
    clearEditContact: (state) => {
      state.selectedContact = undefined;
    },
  },
});

export const { selectEditContact, clearEditContact } = contactSlice.actions;
export default contactSlice;
