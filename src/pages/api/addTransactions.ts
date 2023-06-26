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

  const { sellerPubKey, buyerPubKey, certificateId, amount } = req.body;

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

    const createdTransaction = await prisma.transaction.create({
      data: {
        sellerPubKey,
        buyerPubKey,
        certificateId,
        amount,
        seller: { connect: { pubKey: sellerPubKey } },
        buyer: { connect: { pubKey: buyerPubKey } },
        certificate: { connect: { id: certificateId } },
      },
    });

    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
