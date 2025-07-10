'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Paths, signInFields } from '@repo/lib';
import { AuthFieldType, SignInSchemaType } from '@repo/types';
import { Button } from '@repo/ui/client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const [cred, setCred] = useState<SignInSchemaType>({
    email: '',
    password: '',
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
      await signIn('google', {
        callbackUrl: Paths.CHATS,
      });
    } catch (err) {
      setError('Something wrong');
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
                const isPassword = type === 'password';
                
                return (
                  <div key={key}>
                    <label className='text-white text-base font-medium mb-2 block'>
                      {label}
                    </label>
                    <div className='bg-[#2C3333] focus-within:outline focus-within:outline-1   rounded-full flex flex-row justify-center items-center'>
                      <input
                        onChange={(e) => onChangeHandler(e)}
                        value={cred[name as keyof SignInSchemaType ]}
                        name={name}
                        type={isPassword && showPassword ? 'text' : type}
                        className=' text-white  bg-[#2C3333]  w-full text-sm px-4 py-3  rounded-full focus:outline-none'
                        placeholder={placeholder}
                      />
                      {isPassword && (
                        <span
                          className='px-4 cursor-pointer text-white'
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className='w-5 h-5' />
                          ) : (
                            <EyeIcon className='w-5 h-5' />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className='flex flex-col mt-[1.5rem] gap-y-[1rem]'>
            <Button
              type='submit'
              className='w-full  px-4 py-3  tracking-wider font-bold rounded-full text-white bg-[var(--color-auth-form-btn)] focus:outline-none cursor-pointer'
            >
              Sign In
            </Button>

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

            <Button
              onClick={signInWithGoogleHandler}
              type='button'
              className='w-full font-bold  py-3 px-4  tracking-wider  rounded-full text-white bg-[var(--color-auth-form-btn)] focus:outline-none cursor-pointer'
            >
              Sign In With Google
            </Button>
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
