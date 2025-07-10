import { publicRoutes } from '@repo/lib';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;
  const isPublic = publicRoutes.includes(path);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/chats', req.url));
  }

  if (
    token &&
    token.provider === 'google' &&
    !token.phoneNo &&
    req.nextUrl.pathname !== '/add-contact'
  ) {
    return NextResponse.redirect(new URL('/add-contact', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/chats',
    '/profile',
    '/contacts',
    '/chats/:path*',
    '/add-contact',
  ],
};
