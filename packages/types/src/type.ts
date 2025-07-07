import z from 'zod';

import {
  authSchema,
  typingSchema,
  contactSchema,
  signInSchema,
  signUpSchema,
  getStatusSchema,
} from './zod_type';

export type UserDBType = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  id: string;
  password: string;
  provider: string;
  joinedOn: Date;
};

export type UserSliceType = {
  user: UserDBType | undefined;
  isUserExist: boolean;
};

export type Chat = {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  message: string;
};

export type ContactList = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string | null;
  id: string;
  userId: string;
};

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export type SignInSchemaType = z.infer<typeof signInSchema>;

export type ContactSchemaType = z.infer<typeof contactSchema>;

export type EditContactType = Omit<ContactSchemaType, 'email'> & {
  email?: string | null; //Added this
  id: string;
};

export type AuthFieldType = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  key: string;
};

export type ContactFieldsType = {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  name: string;
};

export type SignUpResponse = {
  success: boolean;
  message: string;
};

export type UserType = {
  email: string;
  password: string;
};

export type GetContactListResponse = {
  success: boolean;
  message?: string | Error;
  contacts?: ContactList[];
};

export type isUserValidResponseType = {
  success: boolean;
  message?: string | Error;
  id?: string;
};

export type Gen_Response = {
  success: boolean;
  message: string;
};

export type EditContactParams = {
  contactId: string;
  formData: ContactSchemaType;
};

export type UserContactListType = Omit<ContactList, 'userId'>;

export type ContactSliceStateType = {
  selectedContact: EditContactType | null;
  userContacts: Record<string, UserContactListType>;
};

export type isUserValidType = {
  phoneNo: string;
};

export type GetChatListResponseType = {
  success: boolean;
  chats?: Chat[];
  message: string;
};

export type ChatWithUserType = Chat & {
  sender: { firstName: string; lastName: string; phoneNo: string };
  receiver: { firstName: string; lastName: string; phoneNo: string };
};

export type GetMyChatsType = {
  success: boolean;
  message: string;
  chats?: ChatWithUserType[];
};

export type UserChatsType = Chat & {
  sender: { phoneNo: string };
  receiver: {
    phoneNo: string;
  };
};

export type JWT_Type = {
  phoneNo: string;
  userId: string;
};

export type ChatSocketSendType = {
  type: 'chat';
  sender: string;
  receiver: string;
  createdAt: string;
  text: string;
};

export type AuthSocketSendType = z.infer<typeof authSchema>;

export type TypingSocketSendType = z.infer<typeof typingSchema>;

export type GetStatusSocketSendType = z.infer<typeof getStatusSchema>;

export type ChatSocketResponseType = ChatSocketSendType & {
  id: string;
};

export type TypingSocketResponseType = TypingSocketSendType;

export type GetStatusSocketResponseType = GetStatusSocketSendType & {
  user: string;
  status: 'online' | 'offline';
};

export type BroadcastMyStatusResponseType = {
  type: 'user-status';
  contact: string;
  status: 'online' | 'offline';
};

export type SocketSendType =
  | AuthSocketSendType
  | ChatSocketSendType
  | TypingSocketSendType
  | GetStatusSocketSendType;

export type BroadcastMyStatusPropsType = {
  phoneNo: string;
  status: 'online' | 'offline';
  contactList: string[];
};

export type ChatType = ChatSocketResponseType;

export type AllChatType = ChatType;

export type ChatSliceStateType = {
  currentChat: ChatType[];
  allChats: Record<string, ChatType>;
};

export type ChatHeaderType = {
  chatContact: EditContactType;
};

export type ActiveChatContactType = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  // email?: string | undefined;
  email?: string | null;
  id: string;
};

export type WebscoketStateType = {
  isConnectionActive: boolean;
  contactStatus: boolean;
  activeChatContact: ActiveChatContactType | undefined;
  isTyping: boolean;
  error: string | undefined;
};

export type GetChatsOfUser_ContactType = {
  success: boolean;
  message: string | Error;
  chats?: ChatSocketResponseType[];
};

export type ChatWindowPropsType = {
  isUserExistInfo: boolean;
  chatsData?: ChatSocketResponseType[];
  userPhoneNo?: string;
};

export type ChatListPropsType = {
  chatProps: Record<string, ChatSocketResponseType>;
  contactProps: Record<string, UserContactListType>;
  userPhoneNo: string;
  userId: string;
};

export type ContactsMenuProps = {
  contacts: ContactList[] | undefined;
};

export type ChatWindowWrapperPropsType = {
  contactNo?: string;
  userPhoneNo: string;
};
