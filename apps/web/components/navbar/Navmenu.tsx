'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../packages/ui/src/button';
import { Paths, publicRoutes } from '@repo/lib';

export const Navmenu = () => {
  const { status } = useSession();
  const sessionStatus = useMemo(() => status, [status]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('\n 8 \n');

    if (
      sessionStatus === 'unauthenticated' &&
      !publicRoutes.includes(window.location.pathname)
    ) {
      router.push(Paths.SIGN_IN);
    }
  }, [sessionStatus]);

  const logOutHandler = async () => {
    try {
      await signOut({ callbackUrl: Paths.HOME });
    } catch (err) {
      console.log('Logout failed');
    }
  };

  const NavItem = ({ text, to }: { text: string; to: string }) => {
    return (
      <Link
        href={to}
        className='transition-colors duration-300 hover:text-blue-500 text-white'
      >
        {text}
      </Link>
    );
  };

  return (
    <>
      <div
        className='lg:hidden flex flex-col justify-center gap-1 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='w-[2rem] h-[.4rem] rounded-lg bg-white block'></span>
      </div>
      <div
        className={`font-medium text-lg text-white ${
          isOpen
            ? 'absolute top-[4rem] left-0 w-full bg-[var(--color-primary)] flex flex-col items-center py-4 gap-y-4 z-50 lg:static lg:flex-row lg:w-auto lg:py-0 lg:gap-x-4'
            : 'hidden lg:flex lg:flex-row lg:gap-x-4'
        }`}
      >
        {sessionStatus === 'authenticated' ? (
          <>
            <NavItem text='Chats' to='/chats' />
            <NavItem text='Profile' to='/profile' />
            <NavItem text='Contacts' to='/contacts' />

            <Button
              type='button'
              className='transition-colors duration-300 hover:text-blue-500 text-white'
              onClick={logOutHandler}
            >
              LogOut
            </Button>
          </>
        ) : (
          <>
            <NavItem text='Home' to='/' />
            <NavItem text='SignUp' to='/signup' />
            <NavItem text='SignIn' to='/signin' />
          </>
        )}
      </div>
    </>
  );
};
