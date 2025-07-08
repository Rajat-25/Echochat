import { getContactList } from '../../../actions/ContactActions';
import ContactForm from '../../../components/contact/ContactForm';
import ContactItem from '../../../components/contact/ContactItem';

const Contacts = async () => {
  const response = await getContactList();
  const { success, contacts } = response;
  if (!success) {
    return (
      <div className='p-[1rem] h-[calc(100vh-4rem)] '>
        <div className='h-full flex items-center justify-center text-gray-300'>
          Failed to load contacts.
        </div>
      </div>
    );
  } else {
    return (
      <div className='p-[1rem] h-[calc(100vh-4rem)]'>
        <div className='h-full w-full grid grid-cols-12 gap-[1rem] text-white '>
          <div className='overflow-y-auto bg-[var(--color-authform)] col-span-4 rounded-xl p-4 space-y-[1rem] flex flex-col'>
            <h2 className='text-xl font-semibold'>Your Contacts</h2>
            {contacts?.length === 0 ? (
              <div className='flex-1 flex items-center justify-center  text-gray-300'>
                You do not have any contact.
              </div>
            ) : (
              <div className='flex flex-col gap-[.7rem]  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'>
                {contacts?.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </div>
    );
  }
};

export default Contacts;
