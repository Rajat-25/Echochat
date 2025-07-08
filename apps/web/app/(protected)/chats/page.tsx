import { processedChats, processedContacts } from '@repo/lib';
import { ChatSocketResponseType, UserContactListType } from '@repo/types';
import { getServerSession } from 'next-auth';
import { getMyChats } from '../../../actions/ChatActions';
import { getContactList } from '../../../actions/ContactActions';
import ChatList from '../../../components/chat/ChatList';
import ChatWindowWrapper from '../../../components/chat/ChatWindowWrapper';
import ContactsMenu from '../../../components/contact/ContactsMenu';
import authOptions from '../../../lib/auth';

type ChatsPropsType = {
  searchParams: Promise<{ contact?: string }>;
};

const Chats = async ({ searchParams }: ChatsPropsType) => {
  const { contact: contactNo } = await searchParams;
  const session = await getServerSession(authOptions);

  const { phoneNo: userPhoneNo, id: userId } = session?.user!;

  const { success: contactListSuccess, contacts } = await getContactList();
  const { success: myChatsSuccess, chats } = await getMyChats(userId);

  let chatProps: Record<string, ChatSocketResponseType> = {};
  let contactProps: Record<string, UserContactListType> = {};

  if (myChatsSuccess && chats?.length) {
    chatProps = processedChats(userId, chats);
  }

  if (contactListSuccess && contacts?.length) {
    contactProps = processedContacts(contacts);
  }

  return (
    <div className='p-4 min-h-[calc(100vh-4rem)]  grid grid-cols-12 gap-4 text-white'>
      <div className='relative rounded-xl flex flex-col  gap-4 bg-[var(--color-authform)] col-span-4 p-4'>
        <ChatList
          chatProps={chatProps}
          contactProps={contactProps}
          userPhoneNo={userPhoneNo}
          userId={userId}
        />
        <ContactsMenu contacts={contacts} />
      </div>

      <div className='rounded-xl flex items-center justify-center bg-[var(--color-authform)] col-span-8'>
        <ChatWindowWrapper contactNo={contactNo} userPhoneNo={userPhoneNo} />
      </div>
    </div>
  );
};

export default Chats;
