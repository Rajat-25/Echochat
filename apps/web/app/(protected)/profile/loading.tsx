import {Spinner} from '@repo/ui';
import React from 'react';

const loading = () => {
  return (
    <div className='flex justify-center min-h-[calc(100vh-4rem)] items-center text-white'>
      <Spinner />
    </div>
  );
};

export default loading;
