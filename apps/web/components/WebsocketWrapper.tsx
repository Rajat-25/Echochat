import { getContactList } from '../actions/ContactActions';
import WebsocketProvider from '../providers/websocketProvider';

const WebsocketWrapper = async () => {
  const { contacts, success } = await getContactList();
  const Contacts_phoneNo = contacts?.map((contact) => contact.phoneNo) ?? [];

  return <WebsocketProvider contacts={Contacts_phoneNo} />;
};

export default WebsocketWrapper;
