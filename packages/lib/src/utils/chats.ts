import { AllChatType, ChatWithUserType } from "@repo/types";

export const processedChats = (userId: string, chats: ChatWithUserType[]) => {
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

    return chatsRecord;
  };