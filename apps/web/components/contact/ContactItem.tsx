import { ContactList } from '@repo/types';
import ContactItemClient from './ContactItemClient';

const ContactItem = ({ contact }: { contact: ContactList }) => {
  const { firstName, lastName, phoneNo, id } = contact;

  return (
    <div
      key={id}
      className='bg-[#2A2A2A] rounded-xl p-4 text-[#F5F5F5] flex items-center justify-between gap-4 shadow-md hover:bg-[#3a3a3a] transition w-full'
    >
      <div className='flex gap-4 items-center overflow-hidden'>
        <div className='flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#5626ab] rounded-full flex  items-center justify-center font-medium text-white text-sm md:text-lg'>
          {firstName[0]?.toUpperCase()}

          {lastName[0]?.toUpperCase()}
        </div>

        <div className='flex flex-col overflow-hidden'>
          <span className='font-semibold text-sm md:text-base truncate'>
            {firstName} {lastName}
          </span>
          <span className='text-xs md:text-sm text-[#CCCCCC] truncate'>
            {phoneNo}
          </span>
        </div>
      </div>
      <div className='flex gap-2 overflow-hidden'>
        <ContactItemClient contact={contact}/>
      </div>
    </div>
  );
};

export default ContactItem;
