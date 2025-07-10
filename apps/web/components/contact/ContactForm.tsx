'use client';
import { contactFields } from '@repo/lib';
import { ContactFieldsType, ContactSchemaType } from '@repo/types';
import { Button } from '@repo/ui/client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearEditContact,
  RootState,
  useAddContactMutation,
  useEditContactMutation,
} from '../../store';
import { showError, showSuccess } from '../../lib/toast';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

const initialValue = {
  firstName: '',
  lastName: '',
  phoneNo: '',
  email: '',
};

const ContactForm = () => {
  const [addContact] = useAddContactMutation();
  const [editContact] = useEditContactMutation();
  const router = useRouter();

  const dispatch = useDispatch();

  const selectedContact = useSelector(
    (state: RootState) => state.contact_slice.selectedContact
  );

  const [cred, setCred] = useState<ContactSchemaType>(initialValue);

  useEffect(() => {
    console.log('\n 4 \n');

    if (selectedContact) {
      const { firstName, lastName, phoneNo, email } = selectedContact;
      setCred({
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNo: phoneNo || '',
        email: email || '',
      });
    }
  }, [selectedContact]);

  useEffect(() => {
    console.log('\n 5 \n');

    return () => {
      dispatch(clearEditContact());
    };
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedContact) {
        await editContact({
          contactId: selectedContact.id,
          formData: cred,
        }).unwrap();
        router.refresh();
        showSuccess('Contact updated successfully');
      } else {
        await addContact(cred).unwrap();
        router.refresh();
        showSuccess('Contact added successfully');
      }

      dispatch(clearEditContact());
      setCred(initialValue);
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-[var(--color-authform)] col-span-8 rounded-xl flex flex-col gap-4 p-4 text-white'
    >
      <h2 className='text-2xl font-semibold mb-2'>Enter Details ...</h2>

      {contactFields.map(
        ({ label, type, placeholder, key, name }: ContactFieldsType) => {
          return (
            <div key={key} className='flex flex-col gap-1'>
              <label className='text-base text-[#E0E0E0]'>{label}</label>
              <input
                onChange={onChangeHandler}
                name={name}
                required={type != 'email'}
                type={type}
                pattern={type === 'tel' ? '\\d{10}' : undefined}
                placeholder={placeholder}
                value={cred[name as keyof typeof cred]}
                className='bg-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#999999] px-4 py-2 rounded-md outline-none'
              />
            </div>
          );
        }
      )}

      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition'
      >
        {selectedContact ? 'Update' : 'Add'} Contact
      </Button>
      <ToastContainer />
    </form>
  );
};

export default ContactForm;
