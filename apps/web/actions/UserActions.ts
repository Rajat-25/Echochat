'use server';
import { dbClient } from '@repo/db';
import { Paths, ServerMsg } from '@repo/lib';

import {
  isUserValidResponseType,
  phoneSchema,
  SignUpResponse,
  signUpSchema,
  SignUpSchemaType,
} from '@repo/types';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from '../lib/auth';
import { hashPassword } from '../lib/helper';

const isUserAuthenticated = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user?.id) {
    return { success: false };
  }
  return { success: true, user };
};

const GetUserInfo = async (phoneNo: string) => {
  const authStatus = await isUserAuthenticated();

  if (!authStatus.success) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  }
  try {
    const userInfo = await dbClient.user.findFirst({
      where: {
        phoneNo,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNo: true,
        id: true,
        joinedOn: true,
        contacts: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNo: true,
          },
        },
      },
    });
    if (!userInfo) {
      return {
        success: false,
        message: 'Error while fetching user Info',
      };
    }
    return {
      success: true,
      message: ServerMsg.SUCCESS,
      userInfo,
    };
  } catch (err) {
    console.error('❌ Error in GetUserInfo:', err);
    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
  }
};

const addContactNo = async (formData: FormData) => {
  const phoneNo = formData.get('phoneNo') as string;

  const { success: schemaSuccess } = phoneSchema.safeParse(phoneNo);

  if (!schemaSuccess) {
    redirect(`${Paths.ADD_CONTACT}?error=Invalid Phone Number`);
  }
  const { success, user } = await isUserAuthenticated();

  if (!success) {
    redirect(`${Paths.ADD_CONTACT}?error=Unauthorized`);
  }
  try {
    const res = await dbClient.user.update({
      where: { email: user?.email! },
      data: { phoneNo },
    });
  } catch (error) {
    console.error(
      'Add contact error:',
      error instanceof Error ? error.message : error
    );
    redirect(`${Paths.ADD_CONTACT}?error=Server error, try again`);
  }
  redirect('/api/auth/signout?callbackUrl=/signin');
};

const isUserValid = async (
  phoneNo: string
): Promise<isUserValidResponseType> => {
  const authStatus = await isUserAuthenticated();

  if (!authStatus.success) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const res = await dbClient.user.findFirst({
        where: {
          phoneNo: phoneNo,
        },
      });

      if (!res) {
        return {
          success: false,
          message: 'Not a Valid User',
        };
      } else {
        return {
          success: true,
          message: 'Valid User',
          id: res.id,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err : ServerMsg.SERVER_ERR,
      };
    }
  }
};

const userSignUp = async (data: SignUpSchemaType): Promise<SignUpResponse> => {
  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || 'Invalid Credentials',
    };
  }
  try {
    const { email, phoneNo } = result.data;

    const existingUser = await dbClient.user.findFirst({
      where: {
        OR: [{ email }, { phoneNo }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'Email / Phone number already in use',
      };
    }

    const hashedPassword = await hashPassword(result.data.password);
    await dbClient.user.create({
      data: { ...result.data, password: hashedPassword },
    });

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (err) {
    console.error('Signup Db error:', err);
    return {
      success: false,
      message: 'Failed to create user. Please try again later.',
    };
  }
};

export {
  addContactNo,
  GetUserInfo,
  isUserAuthenticated,
  isUserValid,
  userSignUp
};

