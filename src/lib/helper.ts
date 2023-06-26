import crypto from 'crypto';
import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
// !STARTERCONF This OG is generated from https://github.com/theodorusclarence/og
// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
export function openGraph({
  siteName,
  templateTitle,
  description,
  // !STARTERCONF Or, you can use my server with your own logo.
  logo = 'https://og.<your-domain>/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `https://og.<your-domain>/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

const API = 'http://127.0.0.1:8080';

export const updateEntry = (
  operation: string,
  id: string,
  publicKey: string,
  value: string,
  privateKey: string
): Promise<Response> => {
  const sha256Hash = crypto.createHash('sha256');
  sha256Hash.update(value);
  const hashedValue = sha256Hash.digest('hex');
  const messageObj = {
    id,
    operation,
    value: hashedValue,
  };
  const message = JSON.stringify(messageObj);

  const encoder = new TextEncoder();
  const messageUint8 = encoder.encode(message);
  const secretKeyUint8 = decodeBase64(privateKey);

  const signedMessage = nacl.sign(messageUint8, secretKeyUint8);
  return fetch(API + '/update-entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      signed_message: encodeBase64(new Uint8Array(signedMessage)),
      public_key: publicKey,
      value: hashedValue,
    }),
  });
};

export const getTransactions = (pubKey: string): Promise<Response> => {
  return fetch(`/api/fetchTransactions?pubKey=${pubKey}`);
};

export const validateLastEpoch = async (): Promise<Response> => {
  return fetch(API + '/validate-epoch', {
    method: 'POST',
    body: `"2"`,
  });
};

export const trim = (str: string): string => {
  return str.substring(0, 5) + '...';
};
