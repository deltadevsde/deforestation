import {
  CheckIcon,
  HandThumbUpIcon,
  LightBulbIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

import { trim, validateTransaction } from '@/lib/helper';

import {
  Certificate,
  isCertificate,
  isTransaction,
  Transaction,
  useAuth,
} from '@/components/authContext';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  isOpen: boolean;
  transaction: Transaction | Certificate;
};

export default function VerifyTransactionModal({ isOpen, transaction }: Props) {
  const { company, fetchTransactions } = useAuth();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let timeline = [
    {
      id: 1,
      content: 'Hashing Transaction Data...',
      target: '',
      href: '#',
      date: '',
      datetime: '2020-09-20',
      icon: LightBulbIcon,
      iconBackground: 'bg-gray-400',
    },
    {
      id: 2,
      content: 'H()',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-22',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 3,
      content: 'Validating Transaction...',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-22',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 4,
      content: 'Prooving ...',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-22',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 5,
      content: 'Transaction Validated',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-30',
      icon: HandThumbUpIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 6,
      content: 'Transaction Validated',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-30',
      icon: HandThumbUpIcon,
      iconBackground: 'bg-green-500',
    },
  ];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [displayedEvents, setDisplayedEvents] = useState<typeof timeline>([
    timeline[0],
  ]);

  const parsePoint = (point: string) => {
    const parsedPoint = point.slice(11, -2);

    const pairs = parsedPoint.split(', ');

    // Initialize an empty object
    const obj: Record<string, string> = {};

    // Iterate over the pairs and add them to the object
    for (const pair of pairs) {
      const [key, value] = pair.split(': ');
      obj[key] = value;
    }

    return obj;
  };

  useEffect(() => {
    console.log('aufgerufen');
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    const monthAbbreviation = months[monthIndex];
    const day = currentDate.getDate();

    const formattedDate = `${monthAbbreviation} ${day}`;
    timeline = timeline.map((event) => {
      return {
        ...event,
        date: formattedDate,
      };
    });

    if (isTransaction(transaction)) {
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

      timeline[1].content = 'SHA256(' + JSON.stringify(transactionBody) + ')';

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
            timeline[3].content =
              'Prooving ' +
              trim(res.proofResult.public_param) +
              ' as entry in ' +
              trim(transaction.sellerPubKey) +
              ' Hashchain...';
            const parsedA = parsePoint(res.proofResult.proof.a);
            const parsedB = parsePoint(res.proofResult.proof.b);
            const parsedC = parsePoint(res.proofResult.proof.c);
            timeline[5].target = `BLS12 coordinates:\n
                  a: { x: ${trim(parsedA.x)}, y: ${trim(parsedA.y)} },\n
                  b: { x: ${trim(parsedB.x)}, y: ${trim(parsedB.y)} },\n
                  c: { x: ${trim(parsedC.x)}, y: ${trim(parsedC.y)} }`;
          }
          fetchTransactions();
        });
    } else if (isCertificate(transaction)) {
      const transactionBody = {
        id: transaction.id,
        name: '',
        area: transaction.area,
        amount: transaction.amount,
        receivingCompanyPubKey: transaction.receivingCompanyId,
        issuingCompanyPubKey: transaction.issuingCompanyId,
        validated: false,
      };
      timeline[1].content = 'SHA256(' + JSON.stringify(transactionBody) + ')';

      validateTransaction(
        company!.pubKey,
        JSON.stringify(transactionBody),
        transaction.issuingCompanyId,
        undefined,
        transactionBody.id
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if ('updatedCompany' in res) {
            timeline[3].content =
              'Prooving ' +
              trim(res.proofResult.public_param) +
              ' as entry in ' +
              trim(transaction.issuingCompanyId) +
              ' Hashchain...';
            console.log(res.proofResult);
            const parsedA = parsePoint(res.proofResult.proof.a);
            const parsedB = parsePoint(res.proofResult.proof.b);
            const parsedC = parsePoint(res.proofResult.proof.c);
            timeline[5].target = `BLS12 coordinates:\n
            a: { x: ${trim(parsedA.x)}, y: ${trim(parsedA.y)} },\n
            b: { x: ${trim(parsedB.x)}, y: ${trim(parsedB.y)} },\n
            c: { x: ${trim(parsedC.x)}, y: ${trim(parsedC.y)} }`;
          }
          console.log(res);
          if ('updatedCompany' in res) {
            fetchTransactions();
          }
        });
    }
    setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedEvents((prevEvents) => {
          if (prevEvents.length === timeline.length) {
            clearInterval(interval);
          }
          return timeline.slice(0, prevEvents.length + 1);
        });
      }, 1500);
    }, 500);
  }, [isOpen]);

  return (
    <div className='flow-root h-96 w-full'>
      <ul role='list' className='-mb-8'>
        {displayedEvents.map((event, eventIdx) => (
          <li key={event.id}>
            <div className='relative pb-8'>
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className='absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}
              <div className='relative flex w-full space-x-3'>
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                    )}
                  >
                    <event.icon
                      className='h-5 w-5 text-white'
                      aria-hidden='true'
                    />
                  </span>
                </div>
                <div className='flex w-full flex-1 justify-between space-x-4 pt-1.5'>
                  <div>
                    <p className='text-left text-sm text-gray-500'>
                      {event.content}{' '}
                      <a
                        href={event.href}
                        className='text-left font-medium text-gray-900'
                        dangerouslySetInnerHTML={{ __html: event.target }}
                      />
                    </p>
                  </div>
                  <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
