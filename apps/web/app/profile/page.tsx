import { UserCircleIcon } from '@heroicons/react/24/solid';
import { getServerSession } from 'next-auth';
import { GetUserInfo } from '../../actions/UserActions';
import authOptions from '../../lib/auth';
import { convertToIST } from '../../lib/helper';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  let content;

  if (session?.user?.phoneNo) {
    const { userInfo } = await GetUserInfo(session.user.phoneNo);

    if (!userInfo) {
      content = (
        <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center text-white'>
          Something Went Wrong ...
        </div>
      );
    } else {
      const { email, phoneNo, firstName, joinedOn, lastName, contacts } =
        userInfo;

      content = (
        <div className='min-h-[calc(100vh-4rem)] bg-[#0f0f0f] text-white flex items-center justify-center p-4'>
          <div className='w-full max-w-2xl bg-[#191919] rounded-2xl shadow-lg p-6 space-y-6'>
            <div className='flex flex-col items-center text-center space-y-4'>
              <UserCircleIcon className='w-28 h-28 text-white' />
              <h2 className='text-2xl font-semibold capitalize'>
                {firstName} {lastName}
              </h2>
              <p className='text-gray-400'>
                Joined On {convertToIST(joinedOn)}
              </p>
            </div>

            <div className='space-y-[2rem]'>
              <div className='bg-[#0f0f0f] rounded-xl p-4'>
                <h3 className='text-2xl font-semibold mb-4 text-[#38BDF8] tracking-wide'>
                  About
                </h3>
                {email && (
                  <p className='text-gray-300 text-lg mb-2'>
                    📧 Email: <span className='text-white'>{email}</span>
                  </p>
                )}
                <p className='text-gray-300 text-lg mb-2'>
                  📱 Phone: <span className='text-white '>+91 {phoneNo}</span>
                </p>
                <p className='text-gray-300 text-lg'>
                  👥 Contacts:{' '}
                  <span className='text-white'>{contacts.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    content = (
      <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center text-white'>
        Loading...
      </div>
    );
  }

  return <>{content}</>;
};

export default ProfilePage;
