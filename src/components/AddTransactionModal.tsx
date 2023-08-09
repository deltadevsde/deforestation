import { Dialog, Transition } from '@headlessui/react';
import { ChangeEvent, Fragment, useRef, useState } from 'react';

import { updateEntry } from '@/lib/helper';

import { useAuth } from '@/components/authContext';
import CertificateInput from '@/components/CertificateInput';
import TransactionInput from '@/components/TransactionInput';

type AddTransactionModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isCertificate?: boolean;
};

export default function AddTransactionModal({
  open,
  setOpen,
  isCertificate,
}: AddTransactionModalProps) {
  const cancelButtonRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('buy');
  const [amount, setAmount] = useState(0);
  const [transactionID, setTransactionID] = useState('');
  const [certID, setCertID] = useState('');
  const [buyerSeller, setBuyerSeller] = useState('');
  const [receivingCompany, setReceivingCompany] = useState('');
  const [area, setArea] = useState('');
  const { company, fetchTransactions } = useAuth();

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const resetTransactions = () => {
    setSelectedOption('buy');
    setReceivingCompany('');
    setArea('');
    setAmount(0);
    setCertID('');
    setTransactionID('');
    setBuyerSeller('');
  };

  const postTransaction = async () => {
    if (!company) return;
    const endpoint = isCertificate
      ? '/api/addCertificate'
      : '/api/addTransactions';
    const body = isCertificate
      ? {
          id: company.canIssueCertificates ? '' : certID,
          name: '',
          area,
          amount,
          receivingCompanyPubKey: company.canIssueCertificates
            ? receivingCompany
            : company.pubKey,
          issuingCompanyPubKey: company.canIssueCertificates
            ? company.pubKey
            : receivingCompany,
          validated: false,
        }
      : {
          issuingCompanyPubKey: company.pubKey,
          sellerPubKey: selectedOption === 'buy' ? buyerSeller : company.pubKey,
          buyerPubKey: selectedOption === 'sell' ? buyerSeller : company.pubKey,
          certificateId: certID,
          sellingId: transactionID || '',
          amount,
          validated: false,
        };
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if ('id' in res) {
          const jsonBodyWithID = {
            ...body,
            id: res.id, // add the unique transaction or cert id
          };

          let stringifiedBody = '';

          if (isCertificate) {
            stringifiedBody = JSON.stringify(jsonBodyWithID);
          } else {
            // wenn es sich um einen Verkauf handelt ist die sellingId = der normalen Id und die normale id wird nicht berücksichtigt
            jsonBodyWithID.sellingId =
              selectedOption === 'buy' ? transactionID : res.id;
            // Löschen der issuingCompany-Eigenschaft, die dient nur der Zuordnung im Backend
            const { id, issuingCompanyPubKey, ...updatedBody } = jsonBodyWithID;
            stringifiedBody = JSON.stringify(updatedBody);
          }

          updateEntry(
            'Add',
            company.pubKey,
            company.pubKey,
            stringifiedBody,
            company.privKey
          ).then((res) => {
            if (res) {
              // hier muss jetzt der Klartext irgendwo gepeichert werden, vielleicht im State und in MongoDB
              fetchTransactions();
              setOpen(false);
              resetTransactions();
            } else {
              console.log('Transaction not added to MongoDB');
            }
          });
        } else {
          console.log('missing id flag');
        }
      })
      .finally(() => {
        setOpen(false);
      });
  };

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
                      {isCertificate ? 'Add certificate' : 'Add transaction'}
                    </Dialog.Title>
                    <div className='flex w-full justify-center'>
                      {isCertificate ? (
                        <CertificateInput
                          amount={amount}
                          setAmount={setAmount}
                          receivingCompany={receivingCompany}
                          setReceivingCompany={setReceivingCompany}
                          area={area}
                          setArea={setArea}
                          id={certID}
                          setId={setCertID}
                        />
                      ) : (
                        <TransactionInput
                          amount={amount}
                          setAmount={setAmount}
                          certID={certID}
                          setCertID={setCertID}
                          transactionID={transactionID}
                          setTransactionID={setTransactionID}
                          buyerSeller={buyerSeller}
                          setBuyerSeller={setBuyerSeller}
                          selectedOption={selectedOption}
                          handleOptionChange={handleOptionChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {company?.canIssueCertificates ? (
                  <div className='my-4'>
                    <p className='text-center text-xs text-gray-500'>
                      The issued certificate is valid for 8 weeks from today.
                    </p>
                  </div>
                ) : null}
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2'
                    onClick={() => {
                      postTransaction();
                      setOpen(false);
                    }}
                  >
                    {isCertificate ? 'Add certificate' : 'Add transaction'}
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                    onClick={() => {
                      resetTransactions();
                      setOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
