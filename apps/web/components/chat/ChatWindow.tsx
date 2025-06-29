'use client';
import {
  ChatSocketSendType,
  GetStatusSocketSendType,
  TypingSocketSendType,
} from '@repo/types';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatsOf_User_Contact } from '../../actions/ChatActions';
import { isUserValid } from '../../actions/UserActions';
import { WEBSOCKET_SEND } from '../../lib/websocketActions';
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

const ChatWindow = () => {

  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);

  const { activeChatContact: chatContact, isConnectionActive } = useSelector(
    (state: RootState) => state.websocket_slice
  );

  const chatPhoneNo = chatContact?.phoneNo;

  const isWebcocketConnected = isConnectionActive;

  const { currentChat } = useSelector((state: RootState) => state.chat_slice);

  const { isUserExist } = useSelector((state: RootState) => state.user_slice);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [msg, setMsg] = useState('');

  // const scrollToChatsBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

    if (chatPhoneNo && user?.phoneNo) {
      const typingPayload: TypingSocketSendType = {
        type: 'typing',
        sender: user.phoneNo,
        receiver: chatPhoneNo,
      };

      dispatch({
        type: WEBSOCKET_SEND,
        payload: typingPayload,
      });
    }
  };

  const sendHandler = () => {
    if (!msg || !chatPhoneNo) return;

    const id = new Date().toISOString();

    const outgoingMsg: ChatSocketSendType = {
      type: 'chat' as const,
      receiver: chatPhoneNo,
      sender: user?.phoneNo ?? '',
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

    const fetchUserChats = async () => {
      const { success, chats, message } =
        await getChatsOf_User_Contact(chatPhoneNo);
      if (success && chats?.length) {
        dispatch(setCurrentChat(chats));
      }
    };

    const findIsUserExist = async () => {
      const { success, id, message } = await isUserValid(chatPhoneNo);

      dispatch(setIsUserExist(success));
      if (success) {
        fetchUserChats();
      }
    };

    findIsUserExist();
  }, [chatPhoneNo, isWebcocketConnected]);

  return (
    <>
      {chatContact && isWebcocketConnected ? (
        <div className='grid grid-rows-[auto_1fr_auto] w-full h-full text-white'>
          <ChatHeader chatContact={chatContact} />

          {isUserExist ? (
            <UserChats
              currentChat={currentChat}
              phoneNo={user?.phoneNo}
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
