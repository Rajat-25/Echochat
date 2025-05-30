'use server';

import { dbClient } from '@repo/db';
import { contactSchema, ErrorMsg, Paths } from '@repo/lib';

import { ContactSchemaType, EditContactHandlerParams, Gen_Response, GetContactListResponse } from '@repo/types';
import { revalidatePath } from 'next/cache';
import { isUserAuthenticated } from '../lib/helper';



const getContactList = async (): Promise<GetContactListResponse> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      success: false,
      message: ErrorMsg.UNAUTHORIZED,
    };
  } else {
    try {
      const contactList = await dbClient.contactList.findMany({
        where: {
          userId: Number(user.id),
        },
      });
      return {
        success: true,
        contacts: contactList,
        message: 'Contact list fetched successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err : ErrorMsg.SERVER_ERR,
      };
    }
  }
  
};

const addContactHandler = async (
  formData: ContactSchemaType
): Promise<Gen_Response> => {
  const { user, success } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return { success: false, message: ErrorMsg.UNAUTHORIZED };
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
              id: Number(user.id),
            },
          },
        },
      });
      revalidatePath(Paths.CONTACTS);

      return { success: true, message: 'Contact added successfully' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : ErrorMsg.SERVER_ERR,
      };
    }
  }
};

const deleteContactHandler = async (contactId: number):Promise<Gen_Response> => {
  const { user, success } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return { success: false, message: ErrorMsg.UNAUTHORIZED };
  } else {
    try {
      await dbClient.contactList.deleteMany({
        where: {
          id: contactId,
          userId: Number(user.id),
        },
      });
      revalidatePath(Paths.CONTACTS);
      return { success: true, message: 'Contact deleted successfully' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : ErrorMsg.SERVER_ERR,
      };
    }
  }
};




const editContactHandler = async ({
  contactId,
  formData,
}:EditContactHandlerParams):Promise<Gen_Response> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      message: ErrorMsg.UNAUTHORIZED,
      success: false,
    };
  } else {
    try {
      const res = await dbClient.contactList.updateMany({
        where: {
          userId: Number(user.id),
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
        message: err instanceof Error ? err : ErrorMsg.SERVER_ERR,
      };
    }
  }
};

export {
  addContactHandler,
  deleteContactHandler, editContactHandler, getContactList
};

