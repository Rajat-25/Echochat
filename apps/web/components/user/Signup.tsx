'use client';

import { Paths, signUpFields } from '@repo/lib';
import { AuthFieldType, SignUpSchemaType } from '@repo/types';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useSignUpUserMutation } from '../../store';

const Signup = () => {
  const router = useRouter();
  const [signUpUser] = useSignUpUserMutation();
  const [err, setErr] = useState<string>('');

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [cred, setCred] = useState<SignUpSchemaType>({
    firstName:  '',
    lastName:  '',
    phoneNo:  '',
    email:  '',
    password:  '',
  });

  const signUpWithCredHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    try {
      const { success, message } = await signUpUser(cred).unwrap();

      if (success) {
        await signIn('credentials', {
          email: cred.email,
          password: cred.password,
          redirect: false,
        });

        router.push(Paths.CHATS);
      } else {
        setErr(message);
      }
    } catch (error: any) {
      setErr(error?.data?.message || 'Unexpected error occurred');
    }
  };

  const signUpWithGoogleHandler = async () => {
    try {
      await signIn('google', {
        callbackUrl: Paths.CHATS,
      });
    } catch (err) {
      console.log('Google signup error:', err);
    }
  };
  return (
    <form onSubmit={signUpWithCredHandler} className='flex flex-col'>
      {err && (
        <p className='text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-md border border-red-500'>
          {err}
        </p>
      )}
      <div className='text-white space-y-[1rem]'>
        {signUpFields.map(
          ({ type, label, name, placeholder, key }: AuthFieldType) => {
            return (
              <div key={key}>
                <label className='text-white text-base font-medium mb-2 block'>
                  {label}
                </label>
                <input
                  required
                  onChange={(e) => onChangeHandler(e)}
                  value={cred[name as keyof SignUpSchemaType]}
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
          Create An Account
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
          onClick={signUpWithGoogleHandler}
          type='button'
          className='w-full font-bold  py-3 px-4  tracking-wider  rounded-full text-white bg-[var(--color-auth-form-btn)] focus:outline-none cursor-pointer'
        >
          Sign Up With Google
        </button>
      </div>

      <p className='text-white text-normal mt-6 text-center'>
        Already have an account?{' '}
        <Link
          href={Paths.SIGN_IN}
          className='text-blue-600 font-medium hover:underline ml-1'
        >
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Signup;
