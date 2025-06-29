import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
  if (token.provider === 'google') {
    if (!token.phoneNo && req.nextUrl.pathname !== '/add-contact') {
      return NextResponse.redirect(new URL('/add-contact', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chats', '/profile', '/contacts', '/chats/:path*'],
};
