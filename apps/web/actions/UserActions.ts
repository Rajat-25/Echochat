'use server';
import { dbClient } from '@repo/db';
import { ServerMsg, signUpSchema } from '@repo/lib';
import {
  isUserValidResponseType,
  SignUpResponse,
  SignUpSchemaType
} from '@repo/types';
import { getServerSession } from 'next-auth';
import authOptions from '../lib/auth';
import { hashPassword } from '../lib/helper';

const isUserAuthenticated = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return { success: false };
  } else {
    return { success: true, user };
  }
};


const isUserValid = async (
  phoneNo: string
): Promise<isUserValidResponseType> => {
  const authStatus = await isUserAuthenticated();

  if (!authStatus) {
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

const GetUserInfo = async (phoneNo: string) => {
  const authStatus = await isUserAuthenticated();

  if (!authStatus) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const userInfo = await dbClient.user.findFirst({
        where: {
          phoneNo: phoneNo,
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
  }
};

const addContactNo = async (
  phoneNo: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const { success, user } = await isUserAuthenticated();

  if (!success) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  }
  try {
    await dbClient.user.update({
      where: { email: user?.email! },
      data: { phoneNo },
    });

    return { success: true, message: ServerMsg.SUCCESS };
  } catch (error) {
    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
  }
};

const userSignUp = async (data: SignUpSchemaType): Promise<SignUpResponse> => {
  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid Credentials',
    };
  }
  try {
    const hashedPassword = await hashPassword(result.data.password);
    await dbClient.user.create({
      data: { ...result.data, password: hashedPassword },
    });

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Database error occurred',
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
