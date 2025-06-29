import { Chat, ContactList } from '@repo/db';
import z from 'zod';

import {
  authSchema,
  chatSchema,
  typingSchema,
  contactSchema,
  signInSchema,
  signUpSchema,
  getStatusSchema,
} from '@repo/lib';

type SignUpSchemaType = z.infer<typeof signUpSchema>;

type SignInSchemaType = z.infer<typeof signInSchema>;

type ContactSchemaType = z.infer<typeof contactSchema>;

type EditContactType = ContactSchemaType & {
  id: string;
};

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
  message: string;
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

type isUserValidResponseType = {
  success: boolean;
  message?: string | Error;
  id?: string;
};

type Gen_Response = {
  success: boolean;
  message?: string | Error;
};

type EditContactHandlerParams = {
  contactId: string;
  formData: ContactSchemaType;
};

type UserContactListType = Omit<ContactList, 'userId'>;

type ContactSliceStateType = {
  selectedContact: EditContactType | null;
  userContacts: Record<string, UserContactListType>;
};

type isUserValidType = {
  phoneNo: string;
};

type GetChatListResponseType = {
  success: boolean;
  chats?: Chat[];
  message: string;
};

type ChatWithUserType = Chat & {
  sender: { firstName: string; lastName: string; phoneNo: string };
  receiver: { firstName: string; lastName: string; phoneNo: string };
};

type GetMyChatsType = {
  success: boolean;
  message: string;
  chats?: ChatWithUserType[];
};

type UserChatsType = Chat & {
  sender: { phoneNo: string };
  receiver: {
    phoneNo: string;
  };
};

type ChatWindowPropsType = {
  contacts: ContactList[] | undefined;
};

type JWT_Type = {
  phoneNo: string;
  userId: string;
};

type ChatSocketSendType = {
  type: 'chat';
  sender: string;
  receiver: string;
  createdAt: string;
  text: string;
};

type AuthSocketSendType = z.infer<typeof authSchema>;

type TypingSocketSendType = z.infer<typeof typingSchema>;

type GetStatusSocketSendType = z.infer<typeof getStatusSchema>;

type ChatSocketResponseType = ChatSocketSendType & {
  id: string;
};

type TypingSocketResponseType = TypingSocketSendType;

type GetStatusSocketResponseType = GetStatusSocketSendType & {
  user: string;
  status: 'online' | 'offline';
};

type BroadcastMyStatusResponseType = {
  type: 'user-status';
  contact: string;
  status: 'online' | 'offline';
};

type SocketSendType =
  | AuthSocketSendType
  | ChatSocketSendType
  | TypingSocketSendType
  | GetStatusSocketSendType;

type BroadcastMyStatusPropsType = {
  phoneNo: string;
  status: 'online' | 'offline';
  contactList: string[];
};

// type ChatSocketResponseClientType = ChatSocketResponseType;

// type ChatSocketResponseClientType = Omit<ChatSocketResponseType, 'createdAt'>;

// type ChatType = ChatSocketResponseType & {
//   createdAt: string;
// };

type ChatType = ChatSocketResponseType;

type AllChatType = ChatType;

type ChatSliceStateType = {
  currentChat: ChatType[];
  allChats: Record<string, ChatType>;
};
type ChatHeaderType = {
  chatContact: EditContactType;
};

type ActiveChatContactType = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email?: string | undefined;
  id: string;
};

type WebscoketStateType = {
  isConnectionActive: boolean;
  contactStatus: boolean;
  activeChatContact: ActiveChatContactType | undefined;
  isTyping: boolean;
  error: string | undefined;
};

export type {
  ChatWindowPropsType,
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
  EditContactType,
  ContactSliceStateType,
  isUserValidType,
  GetChatListResponseType,
  ChatWithUserType,
  GetMyChatsType,
  isUserValidResponseType,
  UserChatsType,
  ChatType,
  ChatSliceStateType,
  AllChatType,
  JWT_Type,
  AuthSocketSendType,
  BroadcastMyStatusPropsType,
  ChatSocketSendType,
  GetStatusSocketSendType,
  SocketSendType,
  TypingSocketSendType,
  TypingSocketResponseType,
  ChatSocketResponseType,
  GetStatusSocketResponseType,
  UserContactListType,
  ChatHeaderType,
  BroadcastMyStatusResponseType,
  ActiveChatContactType,
  WebscoketStateType,
};
