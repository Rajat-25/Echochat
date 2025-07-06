import { ChatType } from '@repo/types';
import { RefObject, useEffect } from 'react';

type UserChatsPropsType = {
  currentChat: ChatType[];
  phoneNo: string | undefined;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

const UserChats = ({
  currentChat,
  phoneNo,
  messagesEndRef,
}: UserChatsPropsType) => {


  useEffect(() => {
    console.log('\n 3 \n');

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat.length]);

  return (
    <div className='h-[30.5rem] rounded-xl m-2 bg-zinc-800 flex flex-col gap-2 p-2 overflow-y-auto '>
      {currentChat.map((msg: ChatType) => {
        const { sender, receiver, text, id } = msg;
        return (
          <div
            ref={messagesEndRef}
            key={id}
            className={`max-w-[70%] p-2 rounded-xl ${
              sender === phoneNo
                ? 'bg-blue-600 self-end'
                : 'bg-zinc-600 self-start'
            }`}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

export default UserChats;
