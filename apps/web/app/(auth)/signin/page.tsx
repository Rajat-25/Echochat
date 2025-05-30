'use client';
import { signInFields } from '@repo/lib';
import { AuthFieldType, SignInSchemaType } from '@repo/types';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const [cred, setCred] = useState<SignInSchemaType>({
    email: process.env.NEXT_PUBLIC_DEMO_EMAIL || '',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signInWithCredHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', { ...cred, redirect: false });

      if (res?.ok) {
        router.push('/chats');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const signInWithGoogleHandler = async () => {
    try {
      const res = await signIn('google', {
        callbackUrl: '/chat',
      });
    } catch (err) {
      alert('Something wrong');
    }
  };

  return (
    <div className='bg-[var(--color-primary)] pt-[1rem] min-h-[calc(100vh-4rem)]  flex flex-col justify-center '>
      <div className='bg-[var(--color-authform)] max-w-md w-full mx-auto rounded-2xl p-8'>
        <div className='text-white text-2xl text-center mb-[1.5rem]'>
          Sign In
        </div>

        <form onSubmit={signInWithCredHandler} className='  flex flex-col  '>
          {error && (
            <p className='text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-md border border-red-500'>
              {error}
            </p>
          )}
          <div className='text-white space-y-[1rem]'>
            {signInFields.map(
              ({ type, label, name, placeholder, key }: AuthFieldType) => {
                return (
                  <div key={key}>
                    <label className='text-white text-base font-medium mb-2 block'>
                      {label}
                    </label>
                    <input
                      onChange={(e) => onChangeHandler(e)}
                      value={cred[name as keyof typeof cred]}
                      name={name}
                      type={type}
                      className='text-white bg-[#2C3333]   w-full text-sm px-4 py-3  rounded-full focus:outline-white'
                      placeholder={placeholder}
                    />
                  </div>
                );
              }
            )}
          </div>

          <div className='flex flex-col mt-[1.5rem] gap-y-[1rem]'>
            <button
              type='submit'
              className='w-full  px-4 py-3  tracking-wider font-bold rounded-full text-white bg-[var(--color-auth-form-btn)] focus:outline-none cursor-pointer'
            >
              Sign In
            </button>

            <div className='relative '>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-dashed border-slate-500'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-[var(--color-authform)] px-2 text-slate-400'>
                  or
                </span>
              </div>
            </div>

            <button
              onClick={signInWithGoogleHandler}
              type='button'
              className='w-full font-bold  py-3 px-4  tracking-wider  rounded-full text-white bg-[var(--color-auth-form-btn)] focus:outline-none cursor-pointer'
            >
              Sign In With Google
            </button>
          </div>

          <p className='text-white text-normal mt-6 text-center'>
            Don't have an account?{' '}
            <Link
              href='/signup'
              className='text-blue-600 font-medium hover:underline ml-1'
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
