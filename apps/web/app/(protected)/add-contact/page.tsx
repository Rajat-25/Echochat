import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '@repo/ui';
import { addContactNo } from '../../../actions/UserActions';

type AddContactProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const AddContact = async ({ searchParams }: AddContactProps) => {
  const { success, error } = await searchParams;

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

        <form action={addContactNo} className='space-y-4'>
          <input
            type='text'
            name='phoneNo'
            required
            pattern='\d{10}'
            placeholder='XXXXXXXXXX'
            title='Enter a valid 10-digit phone number '
            className='w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:outline-none'
          />

          <Button
            className='w-full p-2 bg-[--color-auth-form-btn] rounded-xl text-white hover:bg-blue-600'
            type='submit'
          >
            Save Number
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
