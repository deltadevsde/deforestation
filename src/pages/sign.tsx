import { useState } from 'react';

import SignUp from '@/components/Sign';
import SignIn from '@/components/SignIn';

export default function Sign() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className='bg-white px-8 py-12 lg:px-20'>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            className='mx-auto h-10 w-auto'
            src='/images/forest-icon.png'
            alt='Your Company'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign {isSignIn ? 'in to' : 'up for'} your account
          </h2>
        </div>

        {isSignIn ? (
          <SignIn setIsSignIn={() => setIsSignIn(false)} />
        ) : (
          <SignUp setIsSignIn={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
}
