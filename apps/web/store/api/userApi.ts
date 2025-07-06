import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignUpResponse, SignUpSchemaType } from '@repo/types';

const userApi = createApi({
  reducerPath: 'user_api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/user',
  }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation<SignUpResponse, SignUpSchemaType>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useSignUpUserMutation } = userApi;
export default userApi;
