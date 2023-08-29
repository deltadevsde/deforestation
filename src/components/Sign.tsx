import { useState } from 'react';

import { SignInProps } from '@/components/SignIn';

export default function SignUp({ setIsSignIn }: SignInProps) {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Germany');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [provence, setProvence] = useState('');
  const [zip, setZip] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const companyData = {
      name,
      purpose,
      firstName,
      lastName,
      email,
      password,
      country,
      street,
      city,
      provence,
      zip,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        console.log('Unternehmen erfolgreich erstellt');
        // Füge hier deine gewünschte Weiterleitung oder Benachrichtigung hinzu
      } else {
        console.error(
          'Fehler beim Erstellen des Unternehmens:',
          response.statusText
        );
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Unternehmens:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center'>
      <div className='max-w-xl space-y-8'>
        <div className='border-b border-gray-900/10 pb-12'>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='col-span-full'>
              <label
                htmlFor='company'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Company name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='company'
                  id='company'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='purpose'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Business purpose
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='purpose'
                  id='purpose'
                  onChange={(e) => setPurpose(e.target.value)}
                  value={purpose}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='first-name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                First name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='last-name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Last name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='country'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Country
              </label>
              <div className='mt-2'>
                <select
                  id='country'
                  name='country'
                  autoComplete='country-name'
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6'
                >
                  <option>Germany</option>
                  <option>Austria</option>
                  <option>United Kingdom</option>
                  <option>France</option>
                  <option>Italy</option>
                  <option>Sweden</option>
                  <option>Belgium</option>
                  <option>Poland</option>
                  <option>Portugal</option>
                </select>
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='street-address'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Street address
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='street-address'
                  id='street-address'
                  autoComplete='street-address'
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-2 sm:col-start-1'>
              <label
                htmlFor='city'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                City
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='city'
                  id='city'
                  autoComplete='address-level2'
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='region'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                State / Province
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='region'
                  id='region'
                  autoComplete='address-level1'
                  onChange={(e) => setProvence(e.target.value)}
                  value={provence}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='sm:col-span-2'>
              <label
                htmlFor='postal-code'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                ZIP / Postal code
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='postal-code'
                  id='postal-code'
                  autoComplete='postal-code'
                  onChange={(e) => setZip(e.target.value)}
                  value={zip}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Agreements
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            We'll always let you know about important changes.
          </p>
          <div className='mt-2 space-y-10'>
            <fieldset>
              <div className='mt-6 space-y-6'>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='compliance-with-eu-deforestation'
                      name='compliance-with-eu-deforestation'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='compliance-with-eu-deforestation'
                      className='font-medium text-gray-900'
                    >
                      Commitment to Compliance with the EU Deforestation
                      Directive
                    </label>
                    <p className='text-gray-500'>
                      I agree to comply with the EU Deforestation Directive.
                      This includes ensuring that the products we make available
                      on the market do not contribute to deforestation or forest
                      degradation.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='due-diligence-obligations'
                      name='due-diligence-obligations'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='due-diligence-obligations'
                      className='font-medium text-gray-900'
                    >
                      Duty of Care
                    </label>
                    <p className='text-gray-500'>
                      I am fulfilling my due diligence obligations. This
                      includes identifying and assessing the risk of
                      deforestation and forest degradation in our supply chains
                      and implementing measures to mitigate these risks.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='transparency-and-traceability'
                      name='transparency-and-traceability'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='transparency-and-traceability'
                      className='font-medium text-gray-900'
                    >
                      Transparency and Traceability
                    </label>
                    <p className='text-gray-500'>
                      I commit to ensuring transparency and traceability in our
                      supply chains. This includes keeping detailed records of
                      our supply chains and making this information available to
                      the public.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='transparency-dictionary'
                      name='transparency-dictionary'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='transparency-dictionary'
                      className='font-medium text-gray-900'
                    >
                      Use of the Transparency Dictionary System
                    </label>
                    <p className='text-gray-500'>
                      I agree to use the Transparency Dictionary System to
                      monitor and document our compliance with the EU
                      Deforestation Directive.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='obligations-of-distributors'
                      name='obligations-of-distributors'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='obligations-of-distributors'
                      className='font-medium text-gray-900'
                    >
                      Obligations of distributors
                    </label>
                    <p className='text-gray-500'>
                      Distributors that are not small and medium-sized
                      enterprises (SMEs) are considered non-SME operators and
                      are subject to the obligations and provisions in Articles
                      3, 4, 6 and 8 to 13, Article 16(8) to (11) and Article 18
                      in relation to the relevant raw materials and relevant
                      products they make available on the market.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='proof-commitment'
                      name='proof-commitment'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor='proof-commitment'
                      className='font-medium text-gray-900'
                    >
                      Responsibility for compliance
                    </label>
                    <p className='text-gray-500'>
                      Even if I refer to a due diligence declaration already
                      submitted under Article 33, I remain responsible for
                      ensuring that the relevant product complies with Article 3
                      of the Directive. This includes ensuring that no risk or
                      negligible risk has been identified before placing on the
                      market or exporting such relevant products.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className='mt-6'>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
          >
            Register
          </button>
          <p className='mt-2 text-center text-xs text-gray-500'>
            The registration creates a public keypair, which you can use to
            authenticate yourself and interact with the service in the future.
            In any case, please make sure that the key is stored securely.
          </p>
          <p className='mt-4 text-center text-sm text-gray-500'>
            Already a member?{' '}
            <button
              onClick={setIsSignIn}
              className='font-semibold leading-6 text-green-600 hover:text-green-500'
            >
              Sign in now.
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
