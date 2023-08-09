import React from 'react';

import { useAuth } from '@/components/authContext';

type CertificateInputProps = {
  amount: number;
  setAmount: (amount: number) => void;
  receivingCompany: string;
  setReceivingCompany: (receivingCompany: string) => void;
  area: string;
  setArea: (area: string) => void;
  id?: string;
  setId?: (id: string) => void;
};

export default function CertificateInput({
  amount,
  setAmount,
  receivingCompany,
  setReceivingCompany,
  area,
  setArea,
  id,
  setId,
}: CertificateInputProps) {
  const { company } = useAuth();
  return (
    <div className='mt-2 w-2/3'>
      <div className='mt-4'>
        {!company?.canIssueCertificates ? (
          <div className='mt-2 sm:col-span-3'>
            <label
              htmlFor='cert-id'
              className='block text-left text-sm font-medium leading-6 text-gray-900'
            >
              Certificate ID
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='cert-id'
                id='cert-id'
                value={id || ''}
                onChange={(e) => setId && setId(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>
        ) : null}
        <div className='mt-2 sm:col-span-3'>
          <label
            htmlFor='amount'
            className='block text-left text-sm font-medium leading-6 text-gray-900'
          >
            Amount
          </label>
          <div className='mt-2'>
            <input
              type='number'
              name='amount'
              id='amount'
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div className='mt-2 sm:col-span-3'>
          <label
            htmlFor='receiving-company'
            className='block text-left text-sm font-medium leading-6 text-gray-900'
          >
            {company?.canIssueCertificates ? 'Receiving' : 'Issuing'} Company
          </label>
          <div className='mt-2'>
            <input
              type='text'
              name='receiving-company'
              id='receiving-company'
              value={receivingCompany}
              onChange={(e) => setReceivingCompany(e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div className='mt-2 sm:col-span-4'>
          <label
            htmlFor='buyer-or-seller'
            className='block text-left text-sm font-medium leading-6 text-gray-900'
          >
            Area
          </label>
          <div className='mt-2'>
            <input
              id='buyer-or-seller'
              name='buyer-or-seller'
              type='text'
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
