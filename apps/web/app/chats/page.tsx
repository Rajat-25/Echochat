
const Chats = () => {
  return (
    <div className='p-4 min-h-[calc(100vh-4rem)]  grid grid-cols-12 gap-4 text-white'>
      <div className='relative rounded-xl flex flex-col justify-center items-center bg-[var(--color-authform)] col-span-4'>
        <p className='text-gray-400 text-xl sm:text-2xl font-semibold mb-2'>
          What are you waiting for?
        </p>
        <p className='text-gray-500 text-base sm:text-lg'>Start conversation</p>

        <div className='bg-[var(--color-auth-form-btn)] rounded-full flex justify-center items-center  absolute text-2xl font-medium bottom-4 w-10 h-10  right-4 hover:scale-110 cursor-pointer'>
          +
        </div>
      </div>

      <div className='   rounded-xl flex items-center justify-center bg-[var(--color-authform)] col-span-8'>
        <p className='text-gray-400 text-lg sm:text-xl font-medium mb-2'>
          Your Chat will appear here.
        </p>
      </div>
    </div>
  );
};

export default Chats;
