import { Middleware } from '@reduxjs/toolkit';

import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_SEND,
  WEBSOCKET_DISCONNECT,
} from '@repo/lib';

import {
  updateCurrentChat,
  setContactStatus,
  setIsTyping,
  updateAllChatsData,
  setIsConnectionActive,
  setWebsocketError,
} from '../index';
import {
  BroadcastMyStatusResponseType,
  ChatSocketResponseType,
  GetStatusSocketResponseType,
  TypingSocketResponseType,
} from '@repo/types';

let socket: WebSocket | null = null;
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

export const websocketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.type === WEBSOCKET_CONNECT) {
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        return next(action);
      }

      const { args } = action.payload;

      socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);

      socket.onopen = () => {
        console.log('✅ WebSocket connected');
        store.dispatch(setIsConnectionActive(true));
        socket?.send(JSON.stringify({ ...args }));
      };

      socket.onmessage = (e) => {
        try {
          const data:
            | TypingSocketResponseType
            | ChatSocketResponseType
            | GetStatusSocketResponseType
            | BroadcastMyStatusResponseType = JSON.parse(e.data);

          const { type } = data;

          const state = store.getState();

          const {
            phoneNo: activeChatContactNo,
            firstName,
            lastName,
          } = state.websocket_slice.activeChatContact;

          if (type === 'chat' && activeChatContactNo) {
            const { sender } = data as ChatSocketResponseType;
            if (sender === activeChatContactNo) {
              store.dispatch(
                updateCurrentChat({
                  ...data,
                })
              );

              store.dispatch(
                updateAllChatsData({
                  [data.sender]: {
                    ...data,
                  },
                })
              );
            }
          }

          if (type === 'typing' && activeChatContactNo) {
            const { sender, receiver } = data as TypingSocketResponseType;

            if (sender === activeChatContactNo) {
              store.dispatch(setIsTyping(true));

              if (typingTimeout) clearTimeout(typingTimeout);

              typingTimeout = setTimeout(() => {
                store.dispatch(setIsTyping(false));
              }, 1000);
            }
          }

          if (type === 'ask-status' && activeChatContactNo) {
            const { statusOf, status } = data as GetStatusSocketResponseType;
            if (statusOf === activeChatContactNo) {
              store.dispatch(setContactStatus(status === 'online'));
            }
          }

          if (type === 'user-status' && activeChatContactNo) {
            const { contact, status } = data as BroadcastMyStatusResponseType;
            if (contact === activeChatContactNo) {
              store.dispatch(setContactStatus(status === 'online'));
            }
          }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Unknown error';

          setWebsocketError(error);
          console.log('❌ Websocket Client error', err);
        }
      };

      socket.onclose = () => {
        console.log('❌ WebSocket closed');
        store.dispatch(setIsConnectionActive(false));
        socket = null;
      };

      socket.onerror = (err) => {
        console.log('❌ WebSocket error', err);
      };
    } else if (action.type === WEBSOCKET_SEND) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(action.payload));
      }
    } else if (action.type === WEBSOCKET_DISCONNECT) {
      socket?.close();
      socket = null;
    }

    return next(action);
  };
