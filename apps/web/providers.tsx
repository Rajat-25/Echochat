'use client';
// This file is used to wrap the application with providers
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import WebsocketProvider from './providers/websocketProvider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <WebsocketProvider />
        {children}
      </Provider>
    </SessionProvider>
  );
};

export default Providers;
