'use client';
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT } from '@repo/lib';
import { AuthSocketSendType } from '@repo/types';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetSocketSliceState, RootState } from '../store';
import { useSelector } from 'react-redux';

const WebsocketProvider = ({ contacts }: { contacts: string[] }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { isConnectionActive } = useSelector(
    (state: RootState) => state.websocket_slice
  );

  useEffect(() => {
    console.log('\n 7 \n');
    if (status !== 'authenticated') return;

    const connectWebSocket = async () => {
      const args: AuthSocketSendType = {
        type: 'auth',
        token: session?.token,
        contacts,
      };

      dispatch({ type: WEBSOCKET_CONNECT, payload: { args } });
    };

    connectWebSocket();

    return () => {
      if (status === 'authenticated' && isConnectionActive) {
        console.log('\n Disconnecting WebSocket... \n');
        dispatch({
          type: WEBSOCKET_DISCONNECT,
        });
        dispatch(resetSocketSliceState());
      }
    };
  }, [status]);

  return null;
};

export default WebsocketProvider;
