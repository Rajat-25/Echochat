import { ChatHeaderType } from '@repo/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChatHeader = ({ chatContact }: ChatHeaderType) => {

  const { contactStatus, isTyping } = useSelector(
    (state: RootState) => state.websocket_slice
  );

  return (
    <div className='p-2 border-b border-slate-600'>
      <div className='flex items-center gap-2 font-semibold text-lg'>
        <span
          className={`h-2 w-2 rounded-full ${
            contactStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        {chatContact.firstName[0]?.toUpperCase() +
          chatContact.firstName.slice(1)}{' '}
        {chatContact.lastName[0]?.toUpperCase() + chatContact.lastName.slice(1)}
        <span>|</span>
        <span className='flex items-center gap-1 text-sm text-zinc-400'>
          {chatContact.phoneNo}
        </span>
      </div>
      {isTyping && (
        <span className='pl-2 text-xs text-green-400 animate-pulse ml-2'>
          typing ...
        </span>
      )}
    </div>
  );
};

export default ChatHeader;
