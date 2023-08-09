import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  //BanknotesIcon,
  //ArrowDownIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { hash } from 'tweetnacl';
import { decodeUTF8, encodeBase64 } from 'tweetnacl-util';

import { trim } from '@/lib/helper';

import AddTransactionModal from '@/components/AddTransactionModal';
import {
  Certificate,
  isTransaction,
  Transaction,
  useAuth,
} from '@/components/authContext';
import ValidateTransactionModal from '@/components/ValidateTransactionModal';
import ValidateTransparencyDictModal from '@/components/ValidateTransparencyDictModal';

/* type Transaction = {
  id: number;
  name: string;
  href: string;
  amount: string;
  currency: string;
  status: string;
  date: string;
  datetime: string;
}; */

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'History', href: '#', icon: ClockIcon, current: false },
  { name: 'Balances', href: '#', icon: ScaleIcon, current: false },
  { name: 'Cards', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Recipients', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Reports', href: '#', icon: DocumentChartBarIcon, current: false },
];
const secondaryNavigation = [
  { name: 'Settings', href: '#', icon: CogIcon },
  { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
  { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
];
/* const trans: Transaction[] = [
  {
    id: 1,
    name: 'Supply to Tropenbohne Handelsgesellschaft mbH',
    href: '#',
    amount: '2,000',
    currency: 'KG',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  // More transactions...
]; */
const statusStyles: { [key: string]: string } = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function TransparencyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCertificateModal, setIsCertificateModal] = useState(false);
  const [validateTDModalOpen, setvalidateTDModalOpen] = useState(false);
  const [validateTransactionModalOpen, setvalidateTransactionModalOpen] =
    useState(false);
  const [transactionToValidate, setTransactionToValidate] = useState<
    Transaction | Certificate | null
  >(null);
  const { company, transactions, logout, login, fetchTransactions } = useAuth();
  const { push } = useRouter();

  let cards = [
    {
      name: 'Transparency Dictionary',
      href: '#',
      icon: '/images/green-checkmark-icon.png',
      amount: 'Last verified: today',
      buttonName: 'Verify now',
    },
    {
      name: 'Certificate Wallet',
      href: '#',
      icon: '/images/certificate-icon.png',
      amount: '3 active certificates',
      buttonName: 'View certificates',
    },
    {
      name: 'Account balance',
      href: '#',
      icon: '/images/coffee-icon.png',
      amount: '-3.0',
      buttonName: 'View details',
    },
  ];

  if (company && company.canIssueCertificates) {
    cards = cards.filter((card) => card.name === 'Transparency Dictionary');
  }

  const [hoveredTransactionId, setHoveredTransactionId] = useState<
    string | null
  >(null);

  const handleMouseEnter = (transactionId: string) => {
    setHoveredTransactionId(transactionId);
  };

  const handleMouseLeave = () => {
    setHoveredTransactionId(null);
  };

  const calculateCurrentAmount = (): number => {
    if (!transactions) {
      return 0;
    }
    return transactions.reduce((acc, transaction) => {
      if (
        (isTransaction(transaction) &&
          transaction.buyerPubKey === company?.pubKey) ||
        (!isTransaction(transaction) && !company?.canIssueCertificates)
      ) {
        if (transaction.validated) {
          return acc + transaction.amount;
        } else {
          return acc;
        }
      }
      return acc - transaction.amount;
    }, 0);
  };

  const calculateActiveCertificates = (): number => {
    if (!transactions) {
      return 0;
    }
    return transactions.reduce((acc, transaction) => {
      if (
        !isTransaction(transaction) &&
        transaction.receivingCompanyId === company?.pubKey &&
        transaction.validated
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  useEffect(() => {
    if (company) {
      fetchTransactions();
    }
  }, [modalOpen]);

  const renderTransaction = (
    transaction: Transaction | Certificate
  ): JSX.Element => {
    const isHovered = transaction.id === hoveredTransactionId;

    const inputUint8 = decodeUTF8(JSON.stringify(transaction));
    const hashUint8 = hash(inputUint8);
    const hashBase64 = encodeBase64(hashUint8).slice(0, -10);

    const hashLength = hashBase64.length;
    const firstPartLength = Math.ceil(hashLength / 2);
    const secondPartLength = Math.ceil(hashLength / 4);

    const firstPart = hashBase64.slice(0, firstPartLength);
    const secondPart = hashBase64.slice(
      firstPartLength,
      firstPartLength + secondPartLength
    );
    const thirdPart = hashBase64.slice(firstPartLength + secondPartLength);

    if (isTransaction(transaction)) {
      return (
        <li key={transaction.id}>
          <a
            href='#'
            className='block bg-white px-4 py-4 hover:bg-gray-50'
            onMouseEnter={() => handleMouseEnter(transaction.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span className='flex items-center space-x-4'>
              <span className='flex flex-1 space-x-2 truncate'>
                {transaction.buyerPubKey === company?.pubKey ? (
                  <ArrowDownIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowUpIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                )}
                <span className='flex flex-col truncate text-sm text-gray-500'>
                  <span className='truncate'>
                    {isHovered
                      ? `from ${trim(transaction.buyerPubKey)} to ${trim(
                          transaction.sellerPubKey
                        )}`
                      : firstPart}
                  </span>
                  <span>
                    <span className='font-medium text-gray-900'>
                      {isHovered ? transaction.amount : secondPart}
                    </span>{' '}
                    COF
                  </span>
                  <span>
                    <span className='font-medium text-gray-900'>
                      {isHovered ? transaction.certificateId : thirdPart}
                    </span>
                  </span>
                </span>
              </span>
              <ChevronRightIcon
                className='h-5 w-5 flex-shrink-0 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </a>
        </li>
      );
    } else {
      return (
        <li key={transaction.id}>
          <a
            href='#'
            className='block bg-white px-4 py-4 hover:bg-gray-50'
            onMouseEnter={() => handleMouseEnter(transaction.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span className='flex items-center space-x-4'>
              <span className='flex flex-1 space-x-2 truncate'>
                {!company?.canIssueCertificates ? (
                  <ArrowDownIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowUpIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                )}
                <span className='flex flex-col truncate text-sm text-gray-500'>
                  <span className='truncate'>
                    {isHovered
                      ? `from ${trim(transaction.issuingCompanyId)} to ${trim(
                          transaction.receivingCompanyId
                        )}`
                      : firstPart}
                  </span>
                  <span>
                    <span className='font-medium text-gray-900'>
                      {isHovered ? transaction.amount : secondPart}
                    </span>{' '}
                    COF
                  </span>
                  <span>
                    <span className='font-medium text-gray-900'>
                      {isHovered ? transaction.id : thirdPart}
                    </span>
                  </span>
                </span>
              </span>
              <ChevronRightIcon
                className='h-5 w-5 flex-shrink-0 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </a>
        </li>
      );
    }
  };

  const renderTransactionTable = (
    transaction: Transaction | Certificate
  ): JSX.Element => {
    const isHovered = transaction.id === hoveredTransactionId;

    const inputUint8 = decodeUTF8(JSON.stringify(transaction));
    const hashUint8 = hash(inputUint8);
    const hashBase64 = encodeBase64(hashUint8).slice(0, -10);

    const hashLength = hashBase64.length;
    const firstPartLength = Math.ceil(hashLength / 2);
    const secondPartLength = Math.ceil(hashLength / 4);

    const firstPart = hashBase64.slice(0, firstPartLength);
    const secondPart = hashBase64.slice(
      firstPartLength,
      firstPartLength + secondPartLength
    );
    const thirdPart = hashBase64.slice(firstPartLength + secondPartLength);

    const getStyle = (transaction: Transaction | Certificate): string => {
      if (
        company?.canIssueCertificates ||
        (isTransaction(transaction) &&
          transaction.sellerPubKey === company?.pubKey) ||
        transaction.validated
      ) {
        return 'bg-green-100 text-green-800';
      } else {
        return 'bg-red-100 text-red-800';
      }
    };

    if (isTransaction(transaction)) {
      return (
        <tr
          key={transaction.id}
          className='bg-white'
          onMouseEnter={() => handleMouseEnter(transaction.id)}
          onMouseLeave={handleMouseLeave}
        >
          <td className='w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
            <div className='flex'>
              <a
                href='#'
                className='group inline-flex space-x-2 truncate text-sm'
              >
                {transaction.buyerPubKey === company?.pubKey ? (
                  <ArrowDownIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowUpIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                )}
                <p className='truncate text-gray-500 group-hover:text-gray-900'>
                  {`from ${trim(transaction.sellerPubKey)} to ${trim(
                    transaction.buyerPubKey
                  )}`}
                </p>
              </a>
            </div>
          </td>
          <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>
              {transaction.amount}
            </span>
            COF
          </td>
          <td className='hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block'>
            <button
              className={classNames(
                getStyle(transaction),
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
              )}
              onClick={() => {
                setTransactionToValidate(transaction);
                setvalidateTransactionModalOpen(true);
              }}
            >
              {company?.canIssueCertificates ||
              transaction.sellerPubKey === company?.pubKey ||
              transaction.validated
                ? 'verified'
                : 'not verified'}
            </button>
          </td>
          <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>
              {transaction.certificateId}
            </span>
          </td>
        </tr>
      );
    } else {
      return (
        <tr
          key={transaction.id}
          className='bg-white'
          onMouseEnter={() => handleMouseEnter(transaction.id)}
          onMouseLeave={handleMouseLeave}
        >
          <td className='w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
            <div className='flex'>
              <a
                href='#'
                className='group inline-flex space-x-2 truncate text-sm'
              >
                {!company?.canIssueCertificates ? (
                  <ArrowDownIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowUpIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                )}
                <p className='truncate text-gray-500 group-hover:text-gray-900'>
                  {`from ${trim(transaction.issuingCompanyId)} to ${trim(
                    transaction.receivingCompanyId
                  )}`}
                </p>
              </a>
            </div>
          </td>
          <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>
              {transaction.amount}
            </span>
            COF
          </td>
          <td className='hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block'>
            <button
              onClick={async () => {
                setTransactionToValidate(transaction);
                setvalidateTransactionModalOpen(true);
                /* const transactionBody = {
                  id: transaction.id,
                  name: '',
                  area: transaction.area,
                  amount: transaction.amount,
                  receivingCompanyPubKey: transaction.receivingCompanyId,
                  issuingCompanyPubKey: transaction.issuingCompanyId,
                  validated: false,
                };
                validateTransaction(
                  company!.pubKey,
                  JSON.stringify(transactionBody),
                  transaction.issuingCompanyId,
                  undefined,
                  transaction.id
                )
                  .then((res) => {
                    return res.json();
                  })
                  .then((res) => {
                    console.log(res);
                    if ('updatedCompany' in res) {
                      fetchTransactions();
                    }
                  });*/
              }}
              className={classNames(
                getStyle(transaction),
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
              )}
            >
              {company?.canIssueCertificates || transaction.validated
                ? 'verified'
                : 'not verified'}
            </button>
          </td>
          <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
            <span className='font-medium text-gray-900'>{transaction.id}</span>
          </td>
        </tr>
      );
    }
  };

  if (!company) {
    if (typeof window !== 'undefined') {
      push('/sign');
    }
    return null;
  }
  const unsplashLink =
    company?.firstName === 'Luca'
      ? 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2952&q=80'
      : company.firstName === 'Sofia'
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      : company.firstName === 'Emma'
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1522&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80';
  return (
    <>
      <AddTransactionModal
        open={modalOpen}
        setOpen={setModalOpen}
        isCertificate={isCertificateModal}
      />
      <ValidateTransparencyDictModal
        open={validateTDModalOpen}
        setOpen={setvalidateTDModalOpen}
      />
      <ValidateTransactionModal
        transaction={transactionToValidate}
        open={validateTransactionModalOpen}
        setOpen={setvalidateTransactionModalOpen}
      />
      <div className='min-h-full'>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-40 lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-green-700 pb-4 pt-5'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute right-0 top-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex flex-shrink-0 items-center px-4'>
                    <img
                      className='h-8 w-auto'
                      src='/images/forest-icon.png'
                      alt='Deforestation logo'
                    />
                  </div>
                  <nav
                    className='mt-5 h-full flex-shrink-0 divide-y divide-green-800 overflow-y-auto'
                    aria-label='Sidebar'
                  >
                    <div className='space-y-1 px-2'>
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-green-800 text-white'
                              : 'text-green-100 hover:bg-green-600 hover:text-white',
                            'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon
                            className='mr-4 h-6 w-6 flex-shrink-0 text-green-200'
                            aria-hidden='true'
                          />
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className='mt-6 pt-6'>
                      <div className='space-y-1 px-2'>
                        {secondaryNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className='group flex items-center rounded-md px-2 py-2 text-base font-medium text-green-100 hover:bg-green-600 hover:text-white'
                          >
                            <item.icon
                              className='mr-4 h-6 w-6 text-green-200'
                              aria-hidden='true'
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0' aria-hidden='true'>
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex flex-grow flex-col overflow-y-auto bg-green-700 pb-4 pt-5'>
            <div className='flex flex-shrink-0 items-center px-4'>
              <img
                className='h-8 w-auto'
                src='/images/forest-icon.png'
                alt='Easywire logo'
              />
            </div>
            <nav
              className='mt-5 flex flex-1 flex-col divide-y divide-green-800 overflow-y-auto'
              aria-label='Sidebar'
            >
              <div className='space-y-1 px-2'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-green-800 text-white'
                        : 'text-green-100 hover:bg-green-600 hover:text-white',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon
                      className='mr-4 h-6 w-6 flex-shrink-0 text-green-200'
                      aria-hidden='true'
                    />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className='mt-6 pt-6'>
                <div className='space-y-1 px-2'>
                  {secondaryNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-green-100 hover:bg-green-600 hover:text-white'
                    >
                      <item.icon
                        className='mr-4 h-6 w-6 text-green-200'
                        aria-hidden='true'
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className='flex flex-1 flex-col lg:pl-64'>
          <div className='flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none'>
            <button
              type='button'
              className='border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3CenterLeftIcon className='h-6 w-6' aria-hidden='true' />
            </button>
            {/* Search bar */}
            <div className='flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
              <div className='flex flex-1'>
                <form className='flex w-full md:ml-0' action='#' method='GET'>
                  <label htmlFor='search-field' className='sr-only'>
                    Search
                  </label>
                  <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                    <div
                      className='pointer-events-none absolute inset-y-0 left-0 flex items-center'
                      aria-hidden='true'
                    >
                      <MagnifyingGlassIcon
                        className='h-5 w-5'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      id='search-field'
                      name='search-field'
                      className='block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm'
                      placeholder='Search transactions'
                      type='search'
                    />
                  </div>
                </form>
              </div>
              <div className='ml-4 flex items-center md:ml-6'>
                <button
                  type='button'
                  className='rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='h-6 w-6' aria-hidden='true' />
                </button>

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-3'>
                  <div>
                    <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50'>
                      <img
                        className='h-8 w-8 rounded-full'
                        src={unsplashLink}
                        alt=''
                      />
                      <span className='ml-3 hidden text-sm font-medium text-gray-700 lg:block'>
                        <span className='sr-only'>Open user menu for </span>
                        {company?.firstName} {company?.lastName}
                      </span>
                      <ChevronDownIcon
                        className='ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block'
                        aria-hidden='true'
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <a
                            href='#'
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <a
                            href='#'
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <button
                            onClick={logout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block w-full px-4 py-2 text-left text-sm text-gray-700'
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className='flex-1 pb-8'>
            {/* Page header */}
            <div className='bg-white shadow'>
              <div className='px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
                <div className='py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200'>
                  <div className='min-w-0 flex-1'>
                    {/* Profile */}
                    <div className='flex items-center'>
                      <img
                        className='hidden h-16 w-16 rounded-full sm:block'
                        src={unsplashLink}
                        alt=''
                      />
                      <div>
                        <div className='flex items-center'>
                          <img
                            className='h-16 w-16 rounded-full sm:hidden'
                            src={unsplashLink}
                            alt=''
                          />
                          <h1 className='ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9'>
                            Hello, {company?.firstName} {company?.lastName}
                          </h1>
                        </div>
                        <dl className='mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap'>
                          <dt className='sr-only'>Company</dt>
                          <dd className='flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6'>
                            <BuildingOfficeIcon
                              className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                              aria-hidden='true'
                            />
                            {company?.name}
                          </dd>
                          <dt className='sr-only'>Account status</dt>
                          <dd className='mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0'>
                            <CheckCircleIcon
                              className='mr-1.5 h-5 w-5 flex-shrink-0 text-green-400'
                              aria-hidden='true'
                            />
                            Verified account
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className='mt-6 flex space-x-3 md:ml-4 md:mt-0'>
                    {/* <button
                      type='button'
                      className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    >
                      Add money
                    </button> */}
                    <button
                      type='button'
                      onClick={() => {
                        setIsCertificateModal(true);
                        setModalOpen(true);
                      }}
                      className='inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                    >
                      Add certificate
                    </button>
                    {!company.canIssueCertificates ? (
                      <button
                        type='button'
                        onClick={() => {
                          setIsCertificateModal(false);
                          setModalOpen(true);
                        }}
                        className='inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                      >
                        Add transaction
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8'>
              <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
                <h2 className='text-lg font-medium leading-6 text-gray-900'>
                  Overview
                </h2>
                <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                  {/* Card */}
                  {cards
                    .map((card) => {
                      if (card.name === 'Account balance') {
                        card.amount =
                          calculateCurrentAmount().toFixed(2) + 'COF';
                      }
                      if (card.name === 'Certificate Wallet') {
                        card.amount =
                          calculateActiveCertificates().toString() +
                          ' active certificates';
                      }
                      return card;
                    })
                    .map((card) => (
                      <div
                        key={card.name}
                        className='overflow-hidden rounded-lg bg-white shadow'
                      >
                        <div className='p-5'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0'>
                              <img
                                className='h-6 w-6 text-gray-400'
                                src={card.icon}
                                aria-hidden='true'
                              />
                            </div>
                            <div className='ml-5 w-0 flex-1'>
                              <dl>
                                <dt className='truncate text-sm font-medium text-gray-500'>
                                  {card.name}
                                </dt>
                                <dd>
                                  <div className='text-lg font-medium text-gray-900'>
                                    {card.amount}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className='bg-gray-50 px-5 py-3'>
                          <div className='text-sm'>
                            <a
                              href={card.href}
                              onClick={() => setvalidateTDModalOpen(true)}
                              className='font-medium text-green-700 hover:text-green-900'
                            >
                              {card.buttonName}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
                Recent activity
              </h2>

              {/* Activity list (smallest breakpoint only) */}
              <div className='shadow sm:hidden'>
                <ul
                  role='list'
                  className='mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden'
                >
                  {transactions.map(renderTransaction)}
                </ul>

                <nav
                  className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3'
                  aria-label='Pagination'
                >
                  <div className='flex flex-1 justify-between'>
                    <a
                      href='#'
                      className='relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    >
                      Previous
                    </a>
                    <a
                      href='#'
                      className='relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    >
                      Next
                    </a>
                  </div>
                </nav>
              </div>

              {/* Activity table (small breakpoint and up) */}
              <div className='hidden sm:block'>
                <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
                  <div className='mt-2 flex flex-col'>
                    <div className='min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                          <tr>
                            <th
                              className='bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900'
                              scope='col'
                            >
                              Transaction
                            </th>
                            <th
                              className='bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900'
                              scope='col'
                            >
                              Amount
                            </th>
                            <th
                              className='hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block'
                              scope='col'
                            >
                              Status
                            </th>
                            <th
                              className='bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900'
                              scope='col'
                            >
                              Certificate/Transaction ID
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 bg-white'>
                          {transactions.map(renderTransactionTable)}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <nav
                        className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'
                        aria-label='Pagination'
                      >
                        <div className='hidden sm:block'>
                          {transactions.length > 0 ? (
                            <p className='text-sm text-gray-700'>
                              Showing <span className='font-medium'>1</span> to{' '}
                              <span className='font-medium'>
                                {transactions.length}
                              </span>{' '}
                              of{' '}
                              <span className='font-medium'>
                                {transactions.length}
                              </span>{' '}
                              results
                            </p>
                          ) : (
                            <p className='text-sm text-gray-700'>
                              No transactions found
                            </p>
                          )}
                        </div>
                        {transactions.length > 0 ? (
                          <div className='flex flex-1 justify-between gap-x-3 sm:justify-end'>
                            <a
                              href='#'
                              className='relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400'
                            >
                              Previous
                            </a>
                            <a
                              href='#'
                              className='relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400'
                            >
                              Next
                            </a>
                          </div>
                        ) : null}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
