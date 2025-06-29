import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { dbClient } from '@repo/db';
import {
  BroadcastMyStatusPropsType,
  SocketSendType,
  JWT_Type,
  TypingSocketResponseType,
  GetStatusSocketResponseType,
  ChatSocketResponseType,
  BroadcastMyStatusResponseType,
} from '@repo/types';
import jwt from 'jsonwebtoken';

import {
  authSchema,
  chatSchema,
  getStatusSchema,
  typingSchema,
} from '@repo/lib';

export class WebSocketSingleton {
  private static instance: WebSocketSingleton;
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  private constructor(server: Server) {
    this.wss = new WebSocketServer({
      server,
      maxPayload: 5000,
    });

    const rateLimitStore = new Map<
      WebSocket,
      { count: number; timestamp: number }
    >();

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');

      let currentUserPhoneNo: string | null = null;
      let currentUserId: string | null = null;
      let currentUserContacts: string[] = [];

      const authTimeout = setTimeout(() => {
        if (!currentUserPhoneNo || !currentUserId) {
          ws.send(JSON.stringify({ message: 'Authentication timeout' }));
          ws.close();
          // fix this
        }
      }, 15000);

      ws.on('message', async (data) => {
        const now = Date.now();
        const rateInfo = rateLimitStore.get(ws) || { count: 0, timestamp: now };

        // 1 second window
        if (now - rateInfo.timestamp < 1000) {
          rateInfo.count++;
          if (rateInfo.count > 10) {
            // Allow max 10 messages per second
            ws.send(JSON.stringify({ message: 'Rate limit exceeded' }));
            ws.close();
            return;
          }
        } else {
          rateInfo.count = 1;
          rateInfo.timestamp = now;
        }

        rateLimitStore.set(ws, rateInfo);

        let json: SocketSendType;

        try {
          json = JSON.parse(data.toString());
        } catch {
          ws.send(JSON.stringify({ message: 'Invalid JSON format' }));
          return;
        }
        const { type } = json;

        // Auth handler
        if (type === 'auth') {
          const parseResult = authSchema.safeParse(json);

          if (!parseResult.success) {
            ws.send(
              JSON.stringify({
                message: 'Invalid auth payload',
                errors: parseResult.error.errors,
              })
            );
            ws.close();
            return;
          }
          let decoded;
          try {
            decoded = jwt.verify(
              json.token,
              process.env.JWT_SECRET!
            ) as JWT_Type;
          } catch (err) {
            console.log('\n Error while authencation \n', err);
            ws.send(JSON.stringify({ message: 'Invalid or expired token' }));
            ws.close();
            return;
          }

          const { phoneNo, userId } = decoded;
          const { contacts } = parseResult.data;
          currentUserPhoneNo = phoneNo;
          currentUserId = userId;
          currentUserContacts = contacts;

          this.clients.set(currentUserPhoneNo, ws);
          clearTimeout(authTimeout);

          console.log(`✅ user ${currentUserPhoneNo} CONNECTED`);

          this.broadcastMyStatus({
            phoneNo: currentUserPhoneNo,
            status: 'online',
            contactList: currentUserContacts,
          });
          return;
        }

        // Chat handler
        if (type === 'chat') {
          if (!currentUserPhoneNo || !currentUserId) {
            ws.send(JSON.stringify({ message: 'Not authenticated' }));
            return;
          }
          const parseResult = chatSchema.safeParse(json);

          if (!parseResult.success) {
            console.log(currentUserPhoneNo, '\n hello \n', json);
            console.log('failing here');
            ws.send(
              JSON.stringify({
                message: 'Invalid chat payload',
                errors: parseResult.error.errors,
              })
            );
            return;
          }
          const { receiver, text, createdAt, sender } = parseResult.data;

          const dbUser = await dbClient.user.findUnique({
            where: { phoneNo: receiver },
          });

          if (!dbUser) {
            ws.send(JSON.stringify({ message: 'Receiver not found' }));
            return;
          }

          const dbChat = await dbClient.chat.create({
            data: {
              message: text,
              timestamp: createdAt,
              senderId: currentUserId,
              receiverId: dbUser.id,
            },
          });

          const info: ChatSocketResponseType = {
            id: dbChat.id,
            type: 'chat',
            receiver: dbUser.phoneNo,
            sender: currentUserPhoneNo,
            createdAt: createdAt.toISOString(),
            text,
          };

          this.sendTo(dbUser.phoneNo, JSON.stringify(info));

          console.log(`Received message From ${sender} :`, json);
          return;
        }

        if (type === 'ask-status') {
          if (!currentUserPhoneNo || !currentUserId) {
            ws.send(JSON.stringify({ message: 'Not authenticated' }));
            return;
          }
          const parsed = getStatusSchema.safeParse(json);

          if (!parsed.success) {
            ws.send(
              JSON.stringify({
                type: 'error',
                message: 'Invalid get-status payload',
              })
            );
            return;
          }

          const { statusOf } = parsed.data;
          const isOnline = this.clients.has(statusOf);

          const info: GetStatusSocketResponseType = {
            type: 'ask-status',
            statusOf,
            status: isOnline ? 'online' : 'offline',
            user: currentUserPhoneNo,
          };

          ws.send(JSON.stringify(info));
          return;
        }

        // Typing handler
        if (json.type === 'typing') {
          const parseResult = typingSchema.safeParse(json);

          if (!parseResult.success) {
            ws.send(
              JSON.stringify({
                message: 'Invalid typing payload',
                errors: parseResult.error.errors,
              })
            );
            return;
          }
          const { receiver, sender } = parseResult.data;

          if (receiver) {
            const info: TypingSocketResponseType = {
              type: 'typing',
              receiver,
              sender,
            };
            this.sendTo(receiver, JSON.stringify(info));
          }
          return;
        }

        ws.send(JSON.stringify({ message: 'Invalid message type' }));
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        clearTimeout(authTimeout);
        rateLimitStore.delete(ws);
        if (currentUserPhoneNo) {
          console.log(`❌ user ${currentUserPhoneNo} DISCONNECTED`);
          this.clients.delete(currentUserPhoneNo);
          this.broadcastMyStatus({
            phoneNo: currentUserPhoneNo,
            status: 'offline',
            contactList: currentUserContacts,
          });
        }
      });
    });
  }

  static getInstance(server: Server): WebSocketSingleton {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocketSingleton(server);
    }
    return WebSocketSingleton.instance;
  }

  sendTo(phoneNo: string, chatInfo: string) {
    console.log(`Sending to ${phoneNo}:`, { chatInfo });

    const client = this.clients.get(phoneNo);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(chatInfo);
    }
  }

  private broadcastMyStatus({
    phoneNo,
    status,
    contactList,
  }: BroadcastMyStatusPropsType) {
    const contactSet = new Set(contactList);
    this.clients.forEach((client, contactPhoneNo) => {
      if (
        client.readyState === WebSocket.OPEN &&
        contactSet.has(contactPhoneNo)
      ) {
        const info: BroadcastMyStatusResponseType = {
          type: 'user-status',
          contact: phoneNo,
          status,
        };

        client.send(JSON.stringify(info));
      }
    });
  }
}
