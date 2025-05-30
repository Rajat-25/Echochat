import { dbClient } from '@repo/db';
import { Paths } from '@repo/lib';
import { UserType } from '@repo/types';
import { AuthOptions, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: DefaultUser & {
      id: number;
    };
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials: UserType | undefined) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const dbUser = await dbClient.user.findFirst({
          where: { email: credentials.email },
        });

        if (dbUser && dbUser.password === credentials.password) {
          return { id: String(dbUser.id), email: dbUser.email };
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      return { ...session, user: { ...session?.user, id: token.sub } };
    },
  },
  pages: {
    signIn: Paths.SING_IN,
  },
};

export default authOptions;
