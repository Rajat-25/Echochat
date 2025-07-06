import { ServerMsg } from '@repo/lib';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { editContactHandler } from '../../../../actions/ContactActions';

export const PUT = async (req: NextRequest) => {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json(
      { success: false, message: ServerMsg.UNAUTHORIZED },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const result = await editContactHandler(body);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (err: any) {
    console.log('API err /contact/edit', err?.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server Error',
      },
      {
        status: 500,
      }
    );
  }
};
