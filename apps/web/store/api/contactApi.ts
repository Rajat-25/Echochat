import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ContactSchemaType,
  EditContactParams,
  Gen_Response,
} from '@repo/types';

const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/contact`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    addContact: builder.mutation<Gen_Response, ContactSchemaType>({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
    }),
    editContact: builder.mutation<Gen_Response, EditContactParams>({
      query: ({ contactId, formData }) => ({
        url: `/edit`,
        method: 'PUT',
        body: { contactId, formData },
      }),
    }),
    deleteContact: builder.mutation<Gen_Response, string>({
      query: (contactId) => {
        return {
          url: `/delete`,
          method: 'DELETE',
          body: { contactId },
        };
      },
    }),
  }),
});

export const {
  useAddContactMutation,
  useEditContactMutation,
  useDeleteContactMutation,
} = contactApi;

export default contactApi;
