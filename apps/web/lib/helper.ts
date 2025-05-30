import { getServerSession } from 'next-auth';
import authOptions from './auth';

export const isUserAuthenticated = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return { success: false };
  } else {
    return { success: true, user };
  }
};
