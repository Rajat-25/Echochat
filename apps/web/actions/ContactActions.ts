'use server';

import { dbClient } from '@repo/db';
import { contactSchema, ServerMsg, Paths } from '@repo/lib';

import {
  ContactSchemaType,
  EditContactHandlerParams,
  Gen_Response,
  GetContactListResponse,
} from '@repo/types';
import { revalidatePath } from 'next/cache';
import { isUserAuthenticated } from './UserActions';

const getContactList = async (): Promise<GetContactListResponse> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const contactList = await dbClient.contactList.findMany({
        where: {
          userId: user.id,
        },
      });

      return {
        success: true,
        contacts: contactList,
        message: 'Contact list fetched successfully',
      };
    } catch (err) {
      console.log('Error while fetching ContactList \n', err);
      return {
        success: false,
        message: ServerMsg.SERVER_ERR,
      };
    }
  }
};

const addContactHandler = async (
  formData: ContactSchemaType
): Promise<Gen_Response> => {
  const { user, success } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return { success: false, message: ServerMsg.UNAUTHORIZED };
  }

  const result = contactSchema.safeParse({
    ...formData,
    email: formData.email?.trim() === '' ? undefined : formData.email?.trim(),
  });

  if (!result.success) {
    return { success: false, message: result?.error?.errors[0]?.message };
  } else {
    try {
      await dbClient.contactList.create({
        data: {
          ...result.data,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      revalidatePath(Paths.CONTACTS);

      return { success: true, message: 'Contact added successfully' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : ServerMsg.SERVER_ERR,
      };
    }
  }
};

const deleteContactHandler = async (
  contactId: string
): Promise<Gen_Response> => {
  const { user, success } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return { success: false, message: ServerMsg.UNAUTHORIZED };
  } else {
    try {
      await dbClient.contactList.deleteMany({
        where: {
          id: contactId,
          userId: user.id,
        },
      });
      revalidatePath(Paths.CONTACTS);
      return { success: true, message: 'Contact deleted successfully' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : ServerMsg.SERVER_ERR,
      };
    }
  }
};

const editContactHandler = async ({
  contactId,
  formData,
}: EditContactHandlerParams): Promise<Gen_Response> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      message: ServerMsg.UNAUTHORIZED,
      success: false,
    };
  } else {
    try {
      const res = await dbClient.contactList.updateMany({
        where: {
          userId: user.id,
          id: contactId,
        },
        data: {
          ...formData,
        },
      });
      revalidatePath(Paths.CONTACTS);
      return {
        success: true,
        message: 'Contact updated successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err : ServerMsg.SERVER_ERR,
      };
    }
  }
};

export {
  addContactHandler,
  deleteContactHandler,
  editContactHandler,
  getContactList,
};
