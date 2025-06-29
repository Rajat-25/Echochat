import NavMenu from '@repo/ui/NavMenu';
import Link from 'next/link';

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

export default function Navbar() {

  return (
    <nav className='h-[4rem] bg-[var(--color-primary)] shadow-md px-2 flex justify-between items-center'>
      <div className='font-medium text-lg '>
        <NavItem text='EchoChat' to='/' />
      </div>
      <NavMenu />
    </nav>
  );
}
