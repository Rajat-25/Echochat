'use client';
import { ChatListPropsType, EditContactType } from '@repo/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/navigation';
import {
  clearCurrentChat,
  RootState,
  setActiveChatContact,
  setAllChats,
  setUserContacts,
} from '../../store';

const ChatList = ({
  chatProps,
  contactProps,
  userPhoneNo,
  userId,
}: ChatListPropsType) => {
  const router = useRouter();
  const { allChats } = useSelector((state: RootState) => state.chat_slice);
  const { userContacts } = useSelector(
    (state: RootState) => state.contact_slice
  );

  const dispatch = useDispatch();

  const activeChatContactHandler = (contact: EditContactType) => {
    dispatch(clearCurrentChat());
    dispatch(setActiveChatContact(contact));
    router.push(`/chats?contact=${contact.phoneNo}`);
  };

  useEffect(() => {
    console.log('\n 1 \n');

    if (!userId) return;
    if (chatProps) {
      dispatch(setAllChats(chatProps));
    }
    if (contactProps) {
      dispatch(setUserContacts(contactProps));
    }
  }, [userId, chatProps, contactProps]);

  let content;

  if (Object.keys(allChats).length && Object.keys(userContacts).length) {
    content = (
      <div className='space-y-4'>
        {Object.entries(allChats).map(([contactId, item]) => {
          const { id, type, receiver, sender, createdAt, text } = item;

          const contact = sender === userPhoneNo ? receiver : sender;

          const contactState = userContacts[contact]!;

          const { firstName, lastName } = contactState;

          return (
            <div
              onClick={() => activeChatContactHandler(contactState)}
              key={id}
              className='flex items-center gap-3 p-3 rounded-xl  shadow-sm hover:bg-[var(--color-listItemHoverBg)]  transition  bg-[var(--color-listItemBg)] '
            >
              <div className='flex-shrink-0 w-10 h-10 rounded-full bg-purple-600  text-white flex items-center justify-center text-lg font-semibold'>
                {firstName[0]?.toUpperCase()}
                {lastName[0]?.toUpperCase()}
              </div>
              <div className='flex flex-col'>
                <span className='font-medium  text-zinc-900 dark:text-purple-200 '>
                  {firstName[0]?.toUpperCase() + firstName.slice(1)}{' '}
                  {lastName[0]?.toUpperCase() + lastName.slice(1)}
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
