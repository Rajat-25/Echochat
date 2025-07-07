'use client';
import { ContactList, ContactsMenuProps, EditContactType } from '@repo/types';
import { Button, Spinner } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setActiveChatContact } from '../../store';

const ContactsMenu = ({ contacts }: ContactsMenuProps) => {
  const router = useRouter();
  const { isConnectionActive } = useSelector(
    (state: RootState) => state.websocket_slice
  );

  const dispatch = useDispatch();
  const [contactWindow, setContactWindow] = useState<boolean>(false);
  const [searchContact, setSearchContact] = useState<string>('');

  const activeChatContactHandler = (contact: EditContactType) => {
    dispatch(setActiveChatContact(contact));
    setContactWindow(false);
    router.push(`/chats?contact=${contact.phoneNo}`);
  };

  return (
    <div className='absolute  bottom-4 right-4  '>
      <Button
        type='button'
        onClick={() => setContactWindow((prev) => !prev)}
        className='rounded-full flex justify-center items-center bg-[var(--color-auth-form-btn)] font-medium text-2xl w-10 h-10  hover:scale-110 cursor-pointer'
      >
        +
      </Button>

      {contactWindow && (
        <div className='flex flex-col items-center p-2 gap-2 absolute bottom-12 right-2  shadow-lg  w-48 h-48 bg-zinc-800 rounded-xl  max-w-48 overflow-x-hidden max-h-48 overflow-y-auto'>
          <input
            onChange={(e) => setSearchContact(e.target.value)}
            value={searchContact}
            type='text'
            placeholder='Search Contact ...'
            className='text-white max-w-40 p-2 outline-none text-sm bg-zinc-700 rounded-lg'
          />

          {isConnectionActive && contacts?.length != 0 ? (
            contacts
              ?.filter(({ firstName, lastName, phoneNo }) =>
                `${firstName} ${lastName} ${phoneNo}`
                  .toLowerCase()
                  .includes(searchContact.toLowerCase())
              )
              ?.map(
                ({ email, phoneNo, lastName, firstName, id }: ContactList) => {
                  const arg = {
                    email: email || undefined,
                    phoneNo,
                    lastName,
                    firstName,
                    id,
                  };
                  return (
                    <div
                      key={id}
                      onClick={() => activeChatContactHandler(arg)}
                      className='w-full p-2 flex flex-col rounded-lg  hover:bg-zinc-600 cursor-pointer  '
                    >
                      <span className='text-sm font-semibold'>
                        {firstName} {lastName}
                      </span>
                      <span className='text-xs text-zinc-400'>{phoneNo}</span>
                    </div>
                  );
                }
              )
          ) : (
            <div className='flex h-full items-center justify-center'>
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactsMenu;
