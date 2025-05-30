'use client';
import { contactFields } from '@repo/lib';
import { ContactFieldsType, ContactSchemaType } from '@repo/types';
import { Button } from '@repo/ui/button';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addContactHandler,
  editContactHandler,
} from '../actions/ContactActions';
import { clearEditContact, RootState, selectEditContact } from '../store';

const initialValue = {
  firstName: '',
  lastName: '',
  phoneNo: '',
  email: '',
};

const ContactForm = () => {
  const dispatch = useDispatch();

  const selectedContact = useSelector(
    (state: RootState) => state.contact_slice.selectedContact
  );

  const [cred, setCred] = useState<ContactSchemaType>(initialValue);

  useEffect(() => {
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
    return () => {
      dispatch(selectEditContact(undefined));
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
    if (selectedContact) {
      const res = await editContactHandler({
        contactId: selectedContact.id,
        formData: cred,
      });
    } else {
      const res = await addContactHandler(cred);
    }
    dispatch(clearEditContact());
    setCred(initialValue);
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
    </form>
  );
};

export default ContactForm;
