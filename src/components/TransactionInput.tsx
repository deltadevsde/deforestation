import React from 'react';

type TransactionInputProps = {
  selectedOption: string;
  handleOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  amount: number;
  setAmount: (amount: number) => void;
  certID: string;
  setCertID: (certID: string) => void;
  buyerSeller: string;
  setBuyerSeller: (buyerSeller: string) => void;
  transactionID: string;
  setTransactionID: (certID: string) => void;
};

export default function TransactionInput({
  selectedOption,
  handleOptionChange,
  amount,
  setAmount,
  certID,
  setCertID,
  buyerSeller,
  setBuyerSeller,
  transactionID,
  setTransactionID,
}: TransactionInputProps) {
  return (
    <div className='mt-2 w-2/3'>
      <div className='mt-4 flex justify-evenly'>
        <div className='flex items-center gap-x-3'>
          <input
            id='buy'
            name='buy-sell-type'
            type='radio'
            value='buy'
            checked={selectedOption === 'buy'}
            onChange={handleOptionChange}
            className='h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600'
          />
          <label
            htmlFor='buy'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Buy
          </label>
        </div>
        <div className='flex items-center gap-x-3'>
          <input
            id='sell'
            name='buy-sell-type'
            type='radio'
            value='sell'
            checked={selectedOption === 'sell'}
            onChange={handleOptionChange}
            className='h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600'
          />
          <label
            htmlFor='sell'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Sell
          </label>
        </div>
      </div>
      {selectedOption === 'buy' ? (
        <div className='mt-2 sm:col-span-3'>
          <label
            htmlFor='transaction-id'
            className='block text-left text-sm font-medium leading-6 text-gray-900'
          >
            Transaction ID
          </label>
          <div className='mt-2'>
            <input
              type='text'
              name='transaction-id'
              id='transaction-id'
              value={transactionID}
              onChange={(e) => setTransactionID(e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      ) : null}
      <div className='mt-4'>
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
              value={certID}
              onChange={(e) => setCertID(e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div className='mt-2 sm:col-span-4'>
          <label
            htmlFor='buyer-or-seller'
            className='block text-left text-sm font-medium leading-6 text-gray-900'
          >
            {selectedOption === 'buy' ? 'Seller' : 'Buyer'}
          </label>
          <div className='mt-2'>
            <input
              id='buyer-or-seller'
              name='buyer-or-seller'
              type='text'
              value={buyerSeller}
              onChange={(e) => setBuyerSeller(e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
