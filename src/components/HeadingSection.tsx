import Link from 'next/link';

export default function HeadingSection() {
  return (
    <div className='relative bg-white'>
      <div className='mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8'>
        <div className='px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <img
              className='h-11'
              src='/images/forest-icon.png'
              alt='SINE Deforestation Logo'
            />
            <div className='hidden sm:mt-32 sm:flex lg:mt-16'>
              <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
                Prepare for the upcoming{' '}
                <a
                  href='https://www.europarl.europa.eu/doceo/document/TA-9-2023-0109_DE.pdf'
                  className='whitespace-nowrap font-semibold text-green-600'
                >
                  EU Deforestation Directive
                </a>{' '}
                with SINEs solution.
              </div>
            </div>
            <h3 className='mt-24 text-2xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl'>
              Deforestation-Free Supply Chains Made Easy
            </h3>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Streamline your supply chain management and ensure your products
              are deforestation-free with the cutting-edge Transparency
              Dictionary system from SINE.
            </p>
            <div className='mt-10 flex items-center gap-x-6'>
              <Link
                href='/sign'
                className='rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Get started
              </Link>
              <a
                href='#main-section'
                className='text-sm font-semibold leading-6 text-gray-900'
              >
                Learn more <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
        </div>
        <div className='relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0'>
          <img
            className='aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full'
            src='/images/valley.jpg'
            alt='A nice landscape'
          />
        </div>
      </div>
    </div>
  );
}
