import { getContactList } from '../../actions/ContactActions';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import ContactsMenu from '../../components/contact/ContactsMenu';


const Chats = async () => {
  const { contacts, success } = await getContactList();

  return (
    <div className='p-4 min-h-[calc(100vh-4rem)]  grid grid-cols-12 gap-4 text-white'>
      <div className='relative rounded-xl flex flex-col  gap-4 bg-[var(--color-authform)] col-span-4 p-4'>
        <ChatList />
        <ContactsMenu contacts={contacts} success={success} />
      </div>

      <div className='rounded-xl flex items-center justify-center bg-[var(--color-authform)] col-span-8'>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chats;
