import { NextRequest, NextResponse } from 'next/server';
import { addContactHandler } from '../../../../actions/ContactActions';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const result = await addContactHandler(body);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('API  /contact/add error:', error?.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
