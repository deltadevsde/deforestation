import {
  CheckIcon,
  HandThumbUpIcon,
  LightBulbIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

import { getEpochs, trim, validateLastEpoch } from '@/lib/helper';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  isOpen: boolean;
};

export default function VerifySNARKFeed({ isOpen }: Props) {
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
      content: 'Loading...',
      target: '',
      href: '#',
      date: '',
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
      content: 'Fetching ',
      target: 'BLS12 coordinates',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-30',
      icon: HandThumbUpIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 4,
      content: 'Provided as public parameter...',
      target: '',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-28',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 5,
      content: 'Using ',
      target: 'BLS12 coords\n',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-09-30',
      icon: HandThumbUpIcon,
      iconBackground: 'bg-green-500',
    },
    {
      id: 6,
      content: 'groth16 zkSNARK was',
      target: 'successfully verified!',
      href: '#',
      date: 'Jun 23',
      datetime: '2020-10-04',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
    },
  ];

  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);

  const [loading, setLoading] = useState(true);
  const [lastEpoch, setLastEpoch] = useState<any>(null);
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

    const fetchLastEpoch = async () => {
      setLoading(true);
      getEpochs()
        .then((response) => response.json())
        .then((data) => {
          if ('epochs' in data && data.epochs.length > 0) {
            const lastEpoch = data.epochs[data.epochs.length - 1];
            setLastEpoch(lastEpoch);
            timeline[1].target = `Epoch ${lastEpoch.id}`;
            timeline[2].target = `0x${trim(
              lastEpoch.commitment
            )} (latest commitment)`;
            validateLastEpoch(lastEpoch.id)
              .then((response) => response.json())
              .then((data) => {
                setProof(data);
                if ('proof' in data) {
                  const parsedA = parsePoint(data.proof.a);
                  const parsedB = parsePoint(data.proof.b);
                  const parsedC = parsePoint(data.proof.c);
                  timeline[4].target = `BLS12 coordinates:\n
                  a: { x: ${trim(parsedA.x)}, y: ${trim(parsedA.y)} },\n
                  b: { x: ${trim(parsedB.x)}, y: ${trim(parsedB.y)} },\n
                  c: { x: ${trim(parsedC.x)}, y: ${trim(parsedC.y)} }`;
                }
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            console.log('No epochs found');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchLastEpoch();

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
