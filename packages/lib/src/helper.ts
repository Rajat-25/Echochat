const signUpFields = [
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

const signInFields = [
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

const contactFields = [
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

const Paths = {
  SIGN_UP: '/signup',
  SING_IN: '/signin',
  CONTACTS: '/contacts',
  PROFILE: '/profile',
  CHATS: '/chats',
};




const ErrorMsg = {
  UNAUTHORIZED: 'Unauthorized',
  SERVER_ERR: 'Internal server error',
  INVALID_FORM_DATA: 'Invalid form data',
};


export { contactFields, ErrorMsg, Paths, signInFields, signUpFields };

