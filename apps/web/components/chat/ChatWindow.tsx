'use client';
import {
  ChatSocketSendType,
  ChatWindowPropsType,
  GetStatusSocketSendType,
  TypingSocketSendType,
} from '@repo/types';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WEBSOCKET_SEND } from '@repo/lib';
import {
  clearCurrentChat,
  RootState,
  setCurrentChat,
  updateAllChatsData,
  updateCurrentChat,
} from '../../store';
import { setIsUserExist } from '../../store/slices/userSlice';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import UserChats from './UserChats';

const ChatWindow = ({
  isUserExistInfo,
  chatsData,
  userPhoneNo,
}: ChatWindowPropsType) => {
  const dispatch = useDispatch();
  const { activeChatContact: chatContact, isConnectionActive } = useSelector(
    (state: RootState) => state.websocket_slice
  );

  const chatPhoneNo = chatContact?.phoneNo;

  const isWebcocketConnected = isConnectionActive;

  const { currentChat } = useSelector((state: RootState) => state.chat_slice);

  const { isUserExist } = useSelector((state: RootState) => state.user_slice);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const [msg, setMsg] = useState('');

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    if (chatPhoneNo && userPhoneNo) {
      const typingPayload: TypingSocketSendType = {
        type: 'typing',
        sender: userPhoneNo,
        receiver: chatPhoneNo,
      };

      typingRef.current = setTimeout(() => {
        dispatch({
          type: WEBSOCKET_SEND,
          payload: typingPayload,
        });
      }, 400);
    }
  };

  const sendHandler = () => {
    if (!msg || !chatPhoneNo) return;

    const id = new Date().toISOString();

    const outgoingMsg: ChatSocketSendType = {
      type: 'chat' as const,
      receiver: chatPhoneNo,
      sender: userPhoneNo ?? '',
      createdAt: id,
      text: msg,
    };

    const payload = {
      id,
      ...outgoingMsg,
    };

    dispatch(updateCurrentChat(payload));

    dispatch(
      updateAllChatsData({
        [chatPhoneNo]: payload,
      })
    );

    dispatch({ type: WEBSOCKET_SEND, payload: outgoingMsg });
    setMsg('');
  };

  useEffect(() => {
    console.log('\n 2 \n');

    if (!chatPhoneNo || !isWebcocketConnected) return;
    dispatch(clearCurrentChat());

    const statusPayload: GetStatusSocketSendType = {
      type: 'ask-status',
      statusOf: chatPhoneNo,
    };

    dispatch({
      type: WEBSOCKET_SEND,
      payload: statusPayload,
    });

    dispatch(setIsUserExist(isUserExistInfo));
    if (isUserExistInfo && chatsData?.length) {
      dispatch(setCurrentChat(chatsData));
    }
  }, [chatPhoneNo, isWebcocketConnected, isUserExistInfo, chatsData]);

  return (
    <>
      {chatContact && isWebcocketConnected ? (
        <div className='grid grid-rows-[auto_1fr_auto] w-full h-full text-white'>
          <ChatHeader chatContact={chatContact} />

          {isUserExist ? (
            <UserChats
              currentChat={currentChat}
              phoneNo={userPhoneNo}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <div className='flex flex-col justify-center items-center rounded-xl m-2 bg-zinc-800 p-4 text-center'>
              <p className='text-gray-400 text-lg sm:text-xl font-medium mb-2'>
                User is not registered on the platform.
              </p>
              <p className='text-gray-500 text-base sm:text-lg'>
                Invite them to join on the platform to start chatting.
              </p>
            </div>
          )}

          <ChatInput
            msg={msg}
            onChangeHandler={onChangeHandler}
            sendHandler={sendHandler}
            isUserValid={isUserExist}
          />
        </div>
      ) : (
        <p className='text-gray-400 text-lg sm:text-xl font-medium mb-2'>
          Your Chat will appear here.
        </p>
      )}
    </>
  );
};

export default ChatWindow;
