import { dbClient } from '@repo/db';
import { Paths } from '@repo/lib';
import { UserType } from '@repo/types';
import { AuthOptions, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { comparePassword } from './helper';
import jwt from 'jsonwebtoken';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    phoneNo: string;
  }

  interface Session {
    user: User;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    phoneNo?: string;
    jwt?: string;
    provider?: string;
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const dbUser = await dbClient.user.findFirst({
          where: { email: credentials.email },
        });

        if (dbUser && dbUser.provider !== 'credentials') {
          // User registered via Google, block credential login
          return null;
        }

        if (
          dbUser &&
          (await comparePassword(credentials.password, dbUser.password))
        ) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            phoneNo: dbUser.phoneNo,
          };
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
  session: {
    maxAge: 60 * 60, // 1 hour (in seconds)
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === 'google') {
        const dbUser = await dbClient.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser) {
          await dbClient.user.create({
            data: {
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ')[1] || '',
              email: user.email!,
              password: '',
              provider: 'google',
              phoneNo: '',
            },
          });
        }
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user && account?.provider === 'google') {
        const dbUser = await dbClient.user.findUnique({
          where: { email: user.email! },
        });

        token.id = dbUser?.id;
        token.email = dbUser?.email;
        token.phoneNo = dbUser?.phoneNo;
        token.provider = account.provider;
      }

      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.phoneNo = user.phoneNo;
        token.provider = account.provider;
      }

      if (
        typeof token.phoneNo === 'string' &&
        token.phoneNo.length >= 10 &&
        token.id &&
        !token.jwt
      ) {
        const jwtToken = jwt.sign(
          { userId: token.id, phoneNo: token.phoneNo },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: '1h' }
        );

        token.jwt = jwtToken;
      }

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          phoneNo: token.phoneNo,
          email: token.email,
        },
        token: token.jwt,
      };
    },
  },
  pages: {
    signIn: Paths.SING_IN,
  },
};

export default authOptions;
