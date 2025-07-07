'use server';

import { dbClient } from '@repo/db';
import {  ServerMsg, Paths } from '@repo/lib';
import { contactSchema } from '@repo/types';
import {
  ContactSchemaType,
  EditContactParams,
  Gen_Response,
  GetContactListResponse,
} from '@repo/types';
import { isUserAuthenticated } from './UserActions';

const getContactList = async (): Promise<GetContactListResponse> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      success: false,
      message: ServerMsg.UNAUTHORIZED,
    };
  }

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
    const errorMessage = err instanceof Error ? err.message : 'Debug This';

    console.error('\n Get Contact List   failed:', errorMessage, err, '\n');
    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
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
    return {
      success: false,
      message: result?.error?.errors[0]?.message || 'Invalid input',
    };
  }
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


    return { success: true, message: 'Contact added successfully' };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Debug This';

    console.error('\n Contact Add failed:', errorMessage, err, '\n');

    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
  }
};

const deleteContactHandler = async (
  contactId: string
): Promise<Gen_Response> => {
  const { user, success } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return { success: false, message: ServerMsg.UNAUTHORIZED };
  }

  try {
    await dbClient.contactList.deleteMany({
      where: {
        id: contactId,
        userId: user.id,
      },
    });
    return { success: true, message: 'Contact deleted successfully' };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Debug This';

    console.error('\n Contact deletion failed:', errorMessage, err, '\n');

    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
  }
};

const editContactHandler = async ({
  contactId,
  formData,
}: EditContactParams): Promise<Gen_Response> => {
  const { success, user } = await isUserAuthenticated();

  if (!success || !user?.id) {
    return {
      message: ServerMsg.UNAUTHORIZED,
      success: false,
    };
  }

  const validData = contactSchema.safeParse({
    ...formData,
    email: formData.email?.trim() === '' ? undefined : formData.email?.trim(),
  });

  if (!validData.success) {
    return {
      success: false,
      message: validData.error.issues[0]?.message || 'Invalid contact data',
    };
  }

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
    return {
      success: true,
      message: 'Contact updated successfully',
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Debug This';

    console.error('\n Contact Edit failed:', errorMessage, err, '\n');

    return {
      success: false,
      message: ServerMsg.SERVER_ERR,
    };
  }
};

export {
  addContactHandler,
  deleteContactHandler,
  editContactHandler,
  getContactList,
};
