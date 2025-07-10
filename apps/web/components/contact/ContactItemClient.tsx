'use client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ContactList } from '@repo/types';
import { Button } from '@repo/ui/client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from '../../lib/toast';
import { selectEditContact, useDeleteContactMutation } from '../../store';
import { useRouter } from 'next/navigation';

const ContactItemClient = ({ contact }: { contact: ContactList }) => {
  const router = useRouter();
  const [deleteContact, { isLoading }] = useDeleteContactMutation();
  const { id } = contact;
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const deleteHandler = async () => {
    try {
      const { success, message } = await deleteContact(id).unwrap();
      if (success) {
        showSuccess(message);
        router.refresh();
      } else {
        showError(message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete contact';
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  const editHandler = () => {
    const { email, ...rest } = contact;

    dispatch(
      selectEditContact({
        ...rest,
        email: email || undefined,
      })
    );
  };
  return (
    <>
      <Button
        onClick={editHandler}
        type='button'
        disabled={isLoading}
        className='p-2 rounded text-yellow-400 hover:scale-125 disabled:text-yellow-700 disabled:cursor-not-allowed transition'
      >
        <PencilIcon className='h-6 w-6 ' />
      </Button>
      <Button
        type='button'
        onClick={deleteHandler}
        disabled={isLoading}
        className='p-2 rounded hover:scale-125 text-red-500 disabled:text-red-700 disabled:cursor-not-allowed transition'
      >
        <TrashIcon className='h-6 w-6' />
      </Button>
    </>
  );
};

export default ContactItemClient;
