import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';

import {
  Certificate,
  isTransaction,
  Transaction,
} from '@/components/authContext';
import VerifyTransactionModal from '@/components/VerifyTransactionFeed';

type ValidateTransactionModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transaction: Transaction | Certificate | null;
};

export default function ValidateTransactionModal({
  open,
  setOpen,
  transaction,
}: ValidateTransactionModalProps) {
  const cancelButtonRef = useRef(null);
  const isCertificate = isTransaction(transaction);

  if (!transaction) {
    return null;
  }

  /* useEffect(() => {
    
      const id =
                  transaction.sellerPubKey === company?.pubKey
                    ? transaction.id
                    : transaction.sellingId;
                const transactionBody = {
                  sellerPubKey: transaction.sellerPubKey,
                  buyerPubKey: transaction.buyerPubKey,
                  certificateId: transaction.certificateId,
                  sellingId: id,
                  amount: transaction.amount,
                  validated: false,
                };
                validateTransaction(
                  company!.pubKey,
                  JSON.stringify(transactionBody),
                  transaction.sellerPubKey,
                  id,
                  undefined
                )
                  .then((res) => {
                    return res.json();
                  })
                  .then((res) => {
                    console.log(res);
                    if ('updatedCompany' in res) {
                      fetchTransactions();
                    }
                  });
              }

  }, [open]); */

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                    <img
                      className='h-6 w-6 text-green-600'
                      aria-hidden='true'
                      src='/images/forest-icon.png'
                      alt='SINE forest icon'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      Verify {isCertificate ? 'Certificate' : 'Transaction'}:{' '}
                      {transaction.id}
                    </Dialog.Title>
                    <div className='my-8 flex min-h-[50%] w-full justify-center'>
                      <VerifyTransactionModal
                        isOpen={open}
                        transaction={transaction}
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3'>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                    onClick={() => {
                      setOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Close Modal
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
