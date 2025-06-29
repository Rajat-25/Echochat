'use client';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '@repo/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { addContactNo } from '../../actions/UserActions';

const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

export default function MobileOnboarding() {
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = phoneSchema.safeParse(phoneNo);

    if (!validation.success) {
      setError(
        validation.error?.issues?.[0]?.message || 'Invalid phone number'
      );
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');

    startTransition(async () => {
      const result = await addContactNo(phoneNo);

      if (result.success) {
        setSuccess('Phone number added successfully');
        setTimeout(() => {
          signOut({ callbackUrl: '/signin' });
        }, 1000);
      } else {
        setError(result.message || 'Failed to add phone number');
      }
    });
  };

  return (
    <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[--color-primary] p-4'>
      <div className='w-full max-w-md rounded-2xl bg-[--color-authform] p-6 shadow-lg'>
        <h2 className='mb-4 text-center text-2xl font-semibold text-white'>
          Add Mobile Number
        </h2>

        {/* Success Message */}
        {success && (
          <div className='mb-4 flex items-center gap-2 rounded-xl bg-green-600 p-3 text-white'>
            <CheckCircleIcon className='h-5 w-5' />
            <p className='text-sm'>{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='mb-4 flex items-center gap-2 rounded-xl bg-red-600 p-3 text-white'>
            <XCircleIcon className='h-5 w-5' />
            <p className='text-sm'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            placeholder='Enter Mobile Number'
            className='w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:outline-none'
          />

          <Button
            className='w-full p-2 bg-[--color-auth-form-btn] rounded-xl text-white hover:bg-blue-600'
            type='submit'
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Number'}
          </Button>
        </form>
      </div>
    </div>
  );
}
