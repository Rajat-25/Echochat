import { phoneSchema } from '@repo/lib';
import ChatWindow from './ChatWindow';
import { getChatsOf_User_Contact } from '../../actions/ChatActions';
import { isUserValid } from '../../actions/UserActions';
import { ChatSocketResponseType, ChatWindowWrapperPropsType } from '@repo/types';


const ChatWindowWrapper = async ({
  contactNo,
  userPhoneNo,
}: ChatWindowWrapperPropsType) => {
  if (!contactNo) {
    return (
      <p className='text-gray-400 text-lg sm:text-xl font-medium mb-2'>
        Your Chat will appear here.
      </p>
    );
  }

  const { success: schemaSuccess, data: chatPhoneNo } =
    phoneSchema.safeParse(contactNo);

  if (!schemaSuccess || !chatPhoneNo) {
    return <p className='text-gray-500'>Invalid contact</p>;
  }

  const { success: userValidSuccess } = await isUserValid(chatPhoneNo);

  const isUserExistInfo: boolean = userValidSuccess;

  let chatsData: ChatSocketResponseType[] | undefined;

  if (userValidSuccess) {
    const {
      success: chatSuccess,
      chats,
      message,
    } = await getChatsOf_User_Contact(chatPhoneNo);

    chatsData = chats;
  }

  return (
    <ChatWindow
      isUserExistInfo={isUserExistInfo}
      chatsData={chatsData}
      userPhoneNo={userPhoneNo}
    />
  );
};

export default ChatWindowWrapper;
