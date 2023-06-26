import React, { useState } from 'react';

import { useAuth } from '@/components/authContext';

export type SignInProps = {
  setIsSignIn: () => void;
};

export default function SignIn({ setIsSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
      <div className='space-y-6'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Email address
          </label>
          <div className='mt-2'>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='password'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Password
            </label>
            <div className='text-sm'>
              <a
                href='#'
                className='font-semibold text-green-600 hover:text-green-500'
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className='mt-2'>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <button
            onClick={() => login({ email, password })}
            className='flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
          >
            Sign in
          </button>
        </div>
      </div>

      <p className='mt-10 text-center text-sm text-gray-500'>
        Not a member?{' '}
        <button
          onClick={setIsSignIn}
          className='font-semibold leading-6 text-green-600 hover:text-green-500'
        >
          Register now.
        </button>
      </p>
    </div>
  );
}
