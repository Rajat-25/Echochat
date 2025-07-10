import { Button } from '@repo/ui/client';
import { ChangeEvent } from 'react';

type ChatInputType = {
  msg: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  sendHandler: () => void;
  isUserValid: boolean;
};

const ChatInput = ({
  msg,
  onChangeHandler,
  sendHandler,
  isUserValid,
}: ChatInputType) => {

  

  return (
    <div className='p-2 grid grid-cols-12 gap-2'>
      <input
        onChange={onChangeHandler}
        value={msg}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendHandler();
          }
        }}
        disabled={!isUserValid}
        className={`col-span-10 rounded-xl p-2 outline-none bg-zinc-700 text-white placeholder:text-zinc-400 ${
          !isUserValid && 'opacity-50 cursor-not-allowed'
        }`}
        placeholder='Enter ...'
        type='text'
      />
      <Button
        onClick={sendHandler}
        type='submit'
        disabled={!isUserValid}
        className={`col-span-2 rounded-xl text-white font-semibold ${
          isUserValid
            ? 'bg-blue-700 hover:bg-blue-800'
            : 'bg-red-500 cursor-not-allowed'
        }`}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
