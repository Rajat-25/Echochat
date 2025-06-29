'use client';
import { AuthSocketSendType } from '@repo/types';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getContactList } from '../actions/ContactActions';
import { WEBSOCKET_CONNECT } from '../lib/websocketActions';

const WebsocketProvider = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const connectWebSocket = async () => {
      if (!session?.token) return;

      const { contacts, success } = await getContactList();
      const Contacts_phoneNo =
        contacts?.map((contact) => contact.phoneNo) ?? [];

      const args: AuthSocketSendType = {
        type: 'auth',
        token: session?.token,
        contacts: Contacts_phoneNo,
      };

      dispatch({ type: WEBSOCKET_CONNECT, payload: { args } });
    };
    connectWebSocket();

    //   return () => {
    //     console.log('\n Disconnecting WebSocket...\n');
    //     dispatch({
    //       type: WEBSOCKET_DISCONNECT,
    //     });
    //     dispatch(resetSocketSliceState());
    //   };
  }, [session?.token]);

  return null;
};

export default WebsocketProvider;
