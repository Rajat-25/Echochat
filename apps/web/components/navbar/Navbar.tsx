import Link from 'next/link';
import { Navmenu } from './Navmenu';

const Navbar = () => {
  return (
    <nav className='h-[4rem] bg-[var(--color-primary)] shadow-md px-2 flex justify-between items-center'>
      <div className='font-medium text-lg '>
        <Link
          href='\'
          className='transition-colors duration-300 hover:text-blue-500 text-white'
        >
          EchoChat
        </Link>
      </div>
      <Navmenu />
    </nav>
  );
};

export default Navbar;
