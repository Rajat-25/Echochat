import { NextRequest, NextResponse } from 'next/server';
import { userSignUp } from '../../../../actions/UserActions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await userSignUp(body);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('API Post /signup error:', error?.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
