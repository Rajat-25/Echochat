import { ContactList, UserContactListType } from "@repo/types";

export const processedContacts = (contacts: ContactList[]) => {
    const contactsRecord: Record<string, UserContactListType> = {};
    contacts.forEach(({ userId, ...rest }) => {
      contactsRecord[rest.phoneNo] = rest;
    });

    return contactsRecord;
  };