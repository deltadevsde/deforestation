import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { proofTransaction } from '@/lib/helper';

const prisma = new PrismaClient();

export default async function validateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { transactionId, certificateId, companyPubKey, keyToProve, value } =
    req.body;

  try {
    // Update company transactions
    const company = await prisma.company.findUnique({
      where: { pubKey: companyPubKey },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company Not Found' });
    }

    let proofResult = '';
    await proofTransaction(keyToProve, value)
      .then((result) => {
        console.log('result');
        console.log(result);
        if (!result) {
          return res.status(400).json({ message: 'Invalid Transaction' });
        }
        return result.json();
      })
      .then(async (result) => {
        proofResult = result;
        const updatedTransactions = company.transactions.map((transaction) => {
          const transactionObj = JSON.parse(transaction);
          if (
            transactionObj.sellingId === transactionId ||
            transactionObj.id === certificateId
          ) {
            return JSON.stringify({ ...transactionObj, validated: true });
          }
          return transaction;
        });

        const updatedCompany = await prisma.company.update({
          where: { pubKey: companyPubKey },
          data: {
            transactions: {
              set: updatedTransactions,
            },
          },
        });

        return res.status(200).json({ updatedCompany, proofResult });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
