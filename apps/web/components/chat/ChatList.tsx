'use client';
import { ContactList } from '@repo/db';
import {
  AllChatType,
  ChatWithUserType,
  UserContactListType,
} from '@repo/types';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyChats } from '../../actions/ChatActions';
import { getContactList } from '../../actions/ContactActions';
import { RootState, setAllChats, setUserContacts } from '../../store';

const ChatList = () => {


  const { data: session, status } = useSession();
  const userId = useMemo(() => session?.user?.id, [session]);
  const userContactNo = session?.user.phoneNo;
  const { allChats } = useSelector((state: RootState) => state.chat_slice);
  const { userContacts } = useSelector(
    (state: RootState) => state.contact_slice
  );
  const dispatch = useDispatch();

  const mapContacts = (contacts: ContactList[]) => {
    const contactsRecord: Record<string, UserContactListType> = {};
    contacts.forEach(({ userId, ...rest }) => {
      contactsRecord[rest.phoneNo] = rest;
    });
    dispatch(setUserContacts(contactsRecord));
  };

  const getLatestChat = (userId: string, chats: ChatWithUserType[]) => {
    const chatsRecord: Record<string, AllChatType> = {};

    chats.forEach((chat: ChatWithUserType) => {
      const { senderId, receiverId, sender, receiver, id, message, timestamp } =
        chat;

      const contactId: string =
        senderId !== userId ? sender.phoneNo : receiver.phoneNo;

      chatsRecord[contactId] = {
        id,
        type: 'chat',
        receiver: receiver.phoneNo,
        sender: sender.phoneNo,
        createdAt: timestamp.toISOString(),
        text: message,
      };
    });

    dispatch(setAllChats(chatsRecord));
  };

  useEffect(() => {

    if (!userId) return;
    const getInfo = async () => {
      const { success: chatSuccess, chats } = await getMyChats(userId);
      const { success: contactSuccess, contacts } = await getContactList();

      if (chatSuccess && chats) {
        getLatestChat(userId, chats);
      }
      if (contactSuccess && contacts?.length) {
        mapContacts(contacts);
      }
    };

    getInfo();
  }, [userId]);

  let content;

  if (Object.keys(allChats).length && Object.keys(userContacts).length) {
    content = (
      <div className='space-y-4'>
        {Object.entries(allChats).map(([contactId, item]) => {
          const { id, type, receiver, sender, createdAt, text } =
            item as AllChatType;

          const contact = sender === userContactNo ? receiver : sender;

          const contactState = userContacts[contact]!;

          const { firstName, lastName } = contactState;

          return (
            <div
              key={id}
              className='flex items-center gap-3 p-3 rounded-xl  shadow-sm hover:bg-gray-600  transition bg-zinc-100 dark:bg-zinc-800 '
            >
              <div className='flex-shrink-0 w-10 h-10 rounded-full bg-purple-600  text-white flex items-center justify-center text-lg font-semibold'>
                {firstName[0]?.toUpperCase()}
              </div>
              <div className='flex flex-col'>
                <span className='font-medium  text-zinc-900 dark:text-purple-200 '>
                  {firstName[0]?.toUpperCase() + firstName.slice(1)} {lastName}
                </span>
                <span className='text-sm text-zinc-600 dark:text-zinc-300 truncate max-w-xs'>
                  {text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    content = (
      <div className='h-full flex flex-col justify-center items-center'>
        <>
          <p className='text-gray-400 text-xl sm:text-2xl font-semibold mb-2'>
            What are you waiting for?
          </p>
          <p className='text-gray-500 text-base sm:text-lg'>
            Start conversation
          </p>
        </>
      </div>
    );
  }

  return <>{content}</>;
};

export default ChatList;
