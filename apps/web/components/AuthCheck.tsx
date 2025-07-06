import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import authOptions from '../lib/auth';

const AuthCheck = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/signin');

  const phoneNo = session.user?.phoneNo;
  if (!phoneNo) redirect('/add-contact');

  return <>{children}</>;
};

export default AuthCheck;
