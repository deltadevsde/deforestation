import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function MainSection() {
  return (
    <>
      <div id='main-section' className='bg-white px-6 pt-32 lg:px-8'>
        <div className='mx-auto max-w-3xl text-base leading-7 text-gray-700'>
          <p className='text-base font-semibold leading-7 text-green-600'>
            Introducing
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Sustainable Compliance
          </h1>
          <p className='mt-6 text-xl leading-8'>
            Navigate Supply Chain Complexities and Achieve EU Deforestation
            Directive Compliance with Ease
          </p>
          <div className='mt-10 max-w-2xl'>
            <p>
              In today's global market, ensuring that your products are
              deforestation-free is not just an ethical choice - it's a legal
              requirement under the EU Deforestation Directive. But navigating
              the complexities of supply chain management and compliance can be
              challenging. That's where we come in. Our innovative Transparency
              Dictionary system simplifies the process of achieving and
              demonstrating compliance. With our system, you can easily track
              every transaction, upload and link deforestation-free
              certifications, and identify potential risks in your supply chain.
              But we don't stop at compliance. Our system also offers tools for
              risk assessment and automated reporting, helping you to
              proactively manage your supply chain and demonstrate your
              commitment to sustainability.
            </p>
            <ul role='list' className='mt-8 max-w-xl space-y-8 text-gray-600'>
              <li className='flex gap-x-3'>
                <CheckCircleIcon
                  className='mt-1 h-5 w-5 flex-none text-green-600'
                  aria-hidden='true'
                />
                <span>
                  <strong className='font-semibold text-gray-900'>
                    Transparency Dictionaries
                  </strong>{' '}
                  Our application utilizes Transparency Dictionaries, a
                  revolutionary data structure that allows for tracking
                  transactions in a manner that is both transparent and secure.
                  With Transparency Dictionaries, you can trace every
                  transaction in your supply chain while ensuring the data is
                  immutable and traceable. This provides unprecedented
                  transparency and trustworthiness in the supply chain.
                </span>
              </li>
              <li className='flex gap-x-3'>
                <CheckCircleIcon
                  className='mt-1 h-5 w-5 flex-none text-green-600'
                  aria-hidden='true'
                />
                <span>
                  <strong className='font-semibold text-gray-900'>
                    Zero-Knowledge Proofs
                  </strong>{' '}
                  We employ Zero-Knowledge Proofs, an advanced cryptographic
                  technique that allows for the verification of information
                  without revealing it. With ZKPs, you can prove your products
                  are deforestation-free without disclosing sensitive
                  information. This protects your data and that of your
                  suppliers while simultaneously ensuring compliance with the EU
                  Deforestation Directive.
                </span>
              </li>
              <li className='flex gap-x-3'>
                <CheckCircleIcon
                  className='mt-1 h-5 w-5 flex-none text-green-600'
                  aria-hidden='true'
                />
                <span>
                  <strong className='font-semibold text-gray-900'>
                    Trustless Verification
                  </strong>{' '}
                  Thanks to the combination of Transparency Dictionaries and
                  Zero-Knowledge Proofs, our application is capable of providing
                  trustless verification. You don't have to trust us or other
                  market participants - you can verify compliance with the EU
                  Deforestation Directive yourself. This enhances the security
                  and trust in the system.
                </span>
              </li>
              <li className='flex gap-x-3'>
                <CheckCircleIcon
                  className='mt-1 h-5 w-5 flex-none text-green-600'
                  aria-hidden='true'
                />
                <span>
                  <strong className='font-semibold text-gray-900'>
                    Data Protection and Security
                  </strong>{' '}
                  Our application was designed with the protection of your data
                  at the forefront. With advanced encryption techniques and
                  strict data protection protocols, we ensure your data is safe
                  and secure. Simultaneously, our Zero-Knowledge Proofs enable
                  secure verification without revealing sensitive data.
                </span>
              </li>
            </ul>
            <p className='mt-8'>
              Join us in our mission to make the global market more transparent
              and sustainable. Try our Transparency Dictionary system today and
              see the difference it can make for your business.
            </p>
          </div>
        </div>
      </div>
      <div className='mb-0 mt-24 bg-green-700'>
        <div className='px-6 py-12 sm:px-6 sm:py-24 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h4 className='text-xl font-bold tracking-tight text-white sm:text-2xl'>
              Achieve Compliance with the EU Deforestation Directive
              Effortlessly with Our Innovative Solution <br />
            </h4>
            <p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-green-200'>
              Ready to simplify your compliance process and make a positive
              impact on the environment? Sign up for our Transparency Dictionary
              system today!
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                href='/sign'
                className='rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
              >
                Get started
              </Link>
              <a
                href='#main-section'
                className='text-sm font-semibold leading-6 text-white'
              >
                Learn more <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
