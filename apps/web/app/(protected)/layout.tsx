import { ReactNode } from 'react';
import AuthCheck from '../../components/AuthCheck';
import WebsocketWrapper from '../../components/WebsocketWrapper';
import AutologoutProvider from '../../providers/AutologoutProvider';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthCheck>
      <AutologoutProvider />
      <WebsocketWrapper />
      {children}
    </AuthCheck>
  );
};

export default layout;
