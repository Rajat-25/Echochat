'use server';

import { dbClient } from '@repo/db';
import { signUpSchema, } from '@repo/lib';
import { SignUpResponse, SignUpSchemaType } from '@repo/types';

export async function signUpHandler(
  data: SignUpSchemaType
): Promise<SignUpResponse> {
  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid Credentials',
    };
  } else {
    try {
      const res = await dbClient.user.create({ data: data });

      return {
        success: true,
        message: 'User created successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err : 'Database error occurred',
      };
    }
  }
}
