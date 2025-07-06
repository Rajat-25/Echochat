import { ServerMsg } from '@repo/lib';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { deleteContactHandler } from '../../../../actions/ContactActions';

export const DELETE = async (req: NextRequest) => {
  const token = await getToken({ req });
  const {contactId } = await req.json();
  console.log('hello',contactId)
  if (!token) {
    return NextResponse.json({
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    });
  }
  try {
    const result = await deleteContactHandler(contactId);
    return NextResponse.json(result, {
      status: result?.success ? 200 : 400,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: ServerMsg.SERVER_ERR,
      },
      {
        status: 500,
      }
    );
  }
};
