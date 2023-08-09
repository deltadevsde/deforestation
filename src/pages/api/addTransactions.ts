import { Company, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function addTransactionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    issuingCompanyPubKey,
    sellerPubKey,
    buyerPubKey,
    certificateId,
    sellingId,
    amount,
  } = req.body;

  try {
    const seller: Company | null = await prisma.company.findUnique({
      where: { pubKey: sellerPubKey },
    });

    const buyer: Company | null = await prisma.company.findUnique({
      where: { pubKey: buyerPubKey },
    });

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!seller || !buyer || !certificate) {
      return res.status(404).json({ message: 'Not Found' });
    }

    const dataBody = {
      sellerPubKey,
      buyerPubKey,
      certificateId,
      sellingId,
      amount,
    };

    const createdTransaction = await prisma.transaction.create({
      data: dataBody,
    });

    const dataBodyWithId = {
      id: createdTransaction.id,
      ...dataBody,
      validated: false,
    };

    const company = await prisma.company.update({
      where: { pubKey: issuingCompanyPubKey },
      data: {
        transactions: {
          push: JSON.stringify(dataBodyWithId),
        },
      },
    });

    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
