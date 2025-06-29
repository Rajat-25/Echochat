'use server';
import { dbClient } from '@repo/db';
import { ServerMsg } from '@repo/lib';
import {
  GetChatListResponseType,
  GetMyChatsType,
  UserChatsType,
} from '@repo/types';
import { isUserAuthenticated, isUserValid } from './UserActions';

const getChatsOf_User_Contact = async (contactNo: string) => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const { id: contactId } = await isUserValid(contactNo);
      if (!contactId) {
        return { success: false, message: 'Not A Valid User' };
      }

      const dbChats: UserChatsType[] = await dbClient.chat.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: contactId },
            { senderId: contactId, receiverId: user.id },
          ],
        },
        include: {
          sender: {
            select: { phoneNo: true },
          },
          receiver: {
            select: { phoneNo: true },
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      const chats = dbChats.map((chat: UserChatsType) => {
        const { id, message, sender, receiver, timestamp } = chat;
        return {
          id,
          type: 'chat' as const,
          sender: sender.phoneNo,
          receiver: receiver.phoneNo,
          createdAt: timestamp.toISOString(),
          text: message,
        };
      });

      return { success: true, message: 'Success', chats };
    } catch (err) {
      console.error('GetChatOfUser error:', err);
      return {
        success: false,
        message: ServerMsg.SERVER_ERR,
      };
    }
  }
};

const getChatList = async (): Promise<GetChatListResponseType> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const chats = await dbClient.chat.findMany({
        where: {
          OR: [{ senderId: user?.id }, { receiverId: user?.id }],
        },
      });

      return {
        success: true,
        message: 'Success',
        chats,
      };
    } catch (err) {
      console.error('GetChatList error:', err);
      return {
        success: false,
        message: ServerMsg.SERVER_ERR,
      };
    }
  }
};

const getMyChats = async (id: string): Promise<GetMyChatsType> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const chats = await dbClient.chat.findMany({
        where: {
          OR: [
            {
              senderId: id,
            },
            {
              receiverId: id,
            },
          ],
        },
        include: {
          sender: {
            select: { firstName: true, lastName: true, phoneNo: true },
          },
          receiver: {
            select: { firstName: true, lastName: true, phoneNo: true },
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      const updateChats = chats.map((chat) => ({
        ...chat,
      }));

      return { success: true, message: 'Success', chats: updateChats };
    } catch (err) {
      console.error('GetChatList error:', err);
      return {
        success: false,
        message: ServerMsg.SERVER_ERR,
      };
    }
  }
};

export {
  getChatList,
  getChatsOf_User_Contact,
  getMyChats
};

