import {
  CheckIcon,
  HandThumbUpIcon,
  LightBulbIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

import { validateLastEpoch } from '@/lib/helper';

const timeline = [
  {
    id: 1,
    content: 'Loading...',
    target: '',
    href: '#',
    date: 'Jun 23',
    datetime: '2020-09-20',
    icon: LightBulbIcon,
    iconBackground: 'bg-gray-400',
  },
  {
    id: 2,
    content: 'Fetched latest ',
    target: 'Epoch 8',
    href: '#',
    date: 'Jun 23',
    datetime: '2020-09-22',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 3,
    content: 'Provided public parameters...',
    target: '',
    href: '#',
    date: 'Jun 23',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 4,
    content: 'Using ',
    target: 'BLS12 coordinates',
    href: '#',
    date: 'Jun 23',
    datetime: '2020-09-30',
    icon: HandThumbUpIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 5,
    content: 'groth16 zkSNARK was',
    target: 'successfully verified!',
    href: '#',
    date: 'Jun 23',
    datetime: '2020-10-04',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  isOpen: boolean;
};

export default function VerifySNARKFeed({ isOpen }: Props) {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);

  const [loading, setLoading] = useState(true);
  const [displayedEvents, setDisplayedEvents] = useState<typeof timeline>([
    timeline[0],
  ]);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  const fetchEpoch = async () => {
    setLoading(true);
    validateLastEpoch()
      .then((response) => response.json())
      .then((data) => {
        console.log(data.proof);
        setProof(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEpoch();
  }, []);

  return (
    <div className='flow-root h-72'>
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
              <div className='relative flex space-x-3'>
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
                <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      {event.content}{' '}
                      <a
                        href={event.href}
                        className='font-medium text-gray-900'
                      >
                        {event.target}
                      </a>
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
