'use client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ContactList } from '@repo/db';
import { Button } from '@repo/ui/button';
import { useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import { deleteContactHandler } from '../../actions/ContactActions';
import { selectEditContact } from '../../store';

const ContactItem = ({ contact }: { contact: ContactList }) => {

  const [isPending, startTransition] = useTransition();
  const { firstName, lastName, phoneNo, id } = contact;
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const deleteHandler = () => {
    startTransition(async () => {
      try {
        const res = await deleteContactHandler(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete contact'
        );
      }
    });
  };

  const editHandler = () => {
    const { email, phoneNo, firstName, lastName } = contact;

    dispatch(
      selectEditContact({
        phoneNo,
        firstName,
        lastName,
        email: email || undefined,
        id: contact.id,
      })
    );
  };

  return (
    <div
      key={id}
      className='bg-[#2A2A2A] rounded-xl p-4 text-[#F5F5F5] flex items-center justify-between gap-4 shadow-md hover:bg-[#3a3a3a] transition w-full'
    >
      <div className='flex gap-4 items-center overflow-hidden'>
        <div className='flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-lime-800 rounded-full flex items-center justify-center font-bold text-white text-sm md:text-lg'>
          {firstName[0]}
          {lastName[0]}
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
        <Button
          onClick={editHandler}
          type='button'
          disabled={isPending}
          className='p-2 rounded hover:bg-yellow-600/30 text-yellow-400 disabled:text-yellow-700 disabled:cursor-not-allowed transition'
        >
          <PencilIcon className='h-6 w-6 ' />
        </Button>
        <Button
          type='button'
          onClick={deleteHandler}
          disabled={isPending}
          className='p-2 rounded hover:bg-red-600/30 text-red-500 disabled:text-red-700 disabled:cursor-not-allowed transition'
        >
          <TrashIcon className='h-6 w-6' />
        </Button>
      </div>
    </div>
  );
};

export default ContactItem;
