export const signUpFields = [
  {
    key: 'firstName_su',
    label: 'First Name',
    name: 'firstName',
    type: 'text',
    placeholder: 'Enter your Firstname',
  },
  {
    key: 'lastName_su',
    label: 'Last Name',
    name: 'lastName',
    type: 'text',
    placeholder: 'Enter your Lastname',
  },
  {
    key: 'phoneNo_su',
    label: 'Phone No',
    name: 'phoneNo',
    type: 'tel',
    placeholder: 'Enter Phone No',
  },
  {
    key: 'email_su',
    label: 'Email',
    name: 'email',
    type: 'text',
    placeholder: 'Enter email',
  },
  {
    key: 'password_su',
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter password',
  },
];

export const signInFields = [
  {
    key: 'email_si',
    label: 'Email',
    name: 'email',
    type: 'text',
    placeholder: 'Enter email',
  },
  {
    key: 'password_si',
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter password',
  },
];

export const contactFields = [
  {
    key: 'firstName_cf',
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter Firstname',
  },
  {
    key: 'lastName_cf',
    label: 'Last Name',
    name: 'lastName',
    type: 'text',
    placeholder: 'Enter Lastname',
  },
  {
    key: 'phone_cf',
    label: 'Phone No',
    name: 'phoneNo',
    type: 'tel',
    placeholder: '11-1111-1111',
  },
  {
    key: 'email_cf',
    label: 'Email (Optional)',
    name: 'email',
    type: 'email',
    placeholder: 'Enter Email',
  },
];

export const Paths = {
  HOME:"/",
  SIGN_UP: '/signup',
  SIGN_IN: '/signin',
  CONTACTS: '/contacts',
  PROFILE: '/profile',
  CHATS: '/chats',
  CHATS_DYNAMIC: '/chats/:path*',
  ADD_CONTACT: '/add-contact',
};

export const ServerMsg = {
  SUCCESS: 'Successfully executed',
  UNAUTHORIZED: 'Unauthorized to Perform this action',
  SERVER_ERR: 'Internal server error',
  INVALID_FORM_DATA: 'Invalid form data',
};


const hits = new Map<string, number[]>();

export const rateLimitHelper = (key: string): boolean => {
  const LIMIT = 5; 
  const INTERVAL = 10_000; // in ms (10s)

  const now = Date.now();
  const timestamps = hits.get(key) || [];

  const recent = timestamps.filter((t) => now - t < INTERVAL);

  if (recent.length >= LIMIT) return false;

  recent.push(now);
  hits.set(key, recent);
  return true;
};


export const publicRoutes = ['/', '/signin', '/signup'];

export const protectedRoutes = [
  '/chats',
  '/profile',
  '/contacts',
  '/chats/:path*',
  '/add-contact',
];