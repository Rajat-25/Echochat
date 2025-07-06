'use client';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const AutologoutProvider = () => {

  const { data: session } = useSession();

  useEffect(() => {
    console.log('\n 6 \n');

    if (!session) return;

    const expiry = new Date(session.expires).getTime();
    const timeout = expiry - Date.now();

    const timer = setTimeout(() => {
      signOut();
    }, timeout);

    return () => clearTimeout(timer);
  }, [session]);

  return null;
};

export default AutologoutProvider;
