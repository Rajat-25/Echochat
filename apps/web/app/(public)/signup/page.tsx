import Signup from '../../../components/user/Signup';

const SignUpWrapper = () => {
  return (
    <div className='bg-[var(--color-primary)] pt-[1rem] min-h-[calc(100vh-4rem)]  flex flex-col justify-center '>
      <div className='bg-[var(--color-authform)] max-w-md w-full mx-auto rounded-2xl p-8'>
        <div className='text-white text-2xl text-center mb-[1.5rem]'>
          Sign Up
        </div>
        <Signup />
      </div>
    </div>
  );
};

export default SignUpWrapper;
