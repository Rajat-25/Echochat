'use client';
import { MouseEvent, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import './styles.css';
import { useRouter } from 'next/navigation';

const NavItem = ({ text, to }: { text: string; to: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Link
      href={to}
      className=' transition-colors duration-300 hover:text-blue-500 text-white'
    >
      {text}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  console.log(status);

  const logOutHandler = async () => {
    // e.preventDefault()
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className='h-[4rem] bg-[var(--color-primary)] shadow-md px-2  flex justify-between items-center'>
      <div className='font-medium text-lg '>
        <NavItem text='EchoChat' to='/' />
      </div>
      <div
        className='lg:hidden flex flex-col justify-center gap-1 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='w-6 h-0.5 bg-white block'></span>
      </div>
      <div
        className={`font-medium text-lg text-white ${
          isOpen
            ? 'absolute top-[4rem] left-0 w-full bg-[var(--color-primary)] flex flex-col items-center py-4 gap-y-4 z-50 lg:hidden'
            : 'hidden lg:flex items-center gap-x-4'
        }`}
      >
        {status === 'authenticated' ? (
          <>
            <NavItem text='Chats' to='/chats' />
            <NavItem text='Profile' to='/profile' />
            <NavItem text='Contacts' to='/contacts' />


            <button
              className='transition-colors duration-300 hover:text-blue-500 text-white'
              onClick={logOutHandler}
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            <NavItem text='Home' to='/' />
            <NavItem text='SignUp' to='/signup' />
            <NavItem text='SignIn' to='/signin' />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
