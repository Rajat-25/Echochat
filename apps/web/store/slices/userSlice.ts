import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDBType, UserSliceType } from '@repo/types';


const initialState: UserSliceType = {
  user: undefined,
  isUserExist: false,
};

const userSlice = createSlice({
  name: 'user_slice',
  initialState,
  reducers: {
    userLoggednIn: (state, action: PayloadAction<UserDBType>) => {
      state.user = action.payload;
    },

    userLoggedOut: (state, action) => {
      state.user = undefined;
    },

    setIsUserExist: (state, action: PayloadAction<boolean>) => {
      state.isUserExist = action.payload;
    },
  },
});

export const { userLoggednIn, userLoggedOut, setIsUserExist } =
  userSlice.actions;
export default userSlice;
