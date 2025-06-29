'use client';
import { signUpFields } from '@repo/lib';
import { AuthFieldType, SignUpSchemaType } from '@repo/types';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { userSignUp } from '../../../actions/UserActions';

const SignUp = () => {
  const router = useRouter();
  const [err, setErr] = useState<string>('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [cred, setCred] = useState<SignUpSchemaType>({
    firstName: process.env.NEXT_PUBLIC_DEMO_FIRSTNAME || '',
    lastName: process.env.NEXT_PUBLIC_DEMO_LASTNAME || '',
    phoneNo: process.env.NEXT_PUBLIC_DEMO_PHONE_NO || '',
    email: process.env.NEXT_PUBLIC_DEMO_EMAIL || '',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || '',
  });

  const signUpWithCredHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await userSignUp(cred);

      if (res.success) {
        await signIn('credentials', {
          email: cred.email,
          password: cred.password,
          redirect: false,
        });

        router.push('/chats');
      } else {
        setErr('Something went wrong');
      }
    } catch (error) {
      setErr(
        error instanceof Error ? error.message : 'Unexpected error occurred'
      );
    }
  };

  const signUpWithGoogleHandler = async () => {
    try {
      const res = await signIn('google', {
        callbackUrl: '/chat',
      });
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <div className='bg-[var(--color-primary)] pt-[1rem] min-h-[calc(100vh-4rem)]  flex flex-col justify-center '>
      <div className='bg-[var(--color-authform)] max-w-md w-full mx-auto rounded-2xl p-8'>
        <div className='text-white text-2xl text-center mb-[1.5rem]'>
          Sign Up
        </div>

        <form onSubmit={signUpWithCredHandler} className='  flex flex-col  '>
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
              href='/signin'
              className='text-blue-600 font-medium hover:underline ml-1'
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
