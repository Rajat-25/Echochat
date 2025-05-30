import { ContactList } from '@repo/db';
import z from 'zod';

import { contactSchema, signInSchema, signUpSchema } from '@repo/lib';

type ContactSchemaType = z.infer<typeof contactSchema>;

type SignUpSchemaType = z.infer<typeof signUpSchema>;

type SignInSchemaType = z.infer<typeof signInSchema>;

type AuthFieldType = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  key: string;
};

type ContactFieldsType = {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  name: string;
};
type SignUpResponse = {
  success: boolean;
  message?: string | Error;
};

type UserType = {
  email: string;
  password: string;
};

type GetContactListResponse = {
  success: boolean;
  message?: string | Error;
  contacts?: ContactList[];
};

type Gen_Response = {
  success: boolean;
  message?: string | Error;
};

type EditContactHandlerParams = {
  contactId: number;
  formData: ContactSchemaType;
};



export type {
  AuthFieldType,
  ContactFieldsType,
  SignUpResponse,
  UserType,
  Gen_Response,
  GetContactListResponse,
  EditContactHandlerParams,
  ContactSchemaType,
  SignUpSchemaType,
  SignInSchemaType,
};
