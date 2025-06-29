import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Providers from '../providers';
import './globals.css';
import Navbar from '../components/Navbar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Echochat',
  description: 'Chat seamlessly across regions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`min-h-screen  ${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
