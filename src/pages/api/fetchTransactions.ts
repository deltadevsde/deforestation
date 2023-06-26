import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function fetchTransactionsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pubKey } = req.query;

  try {
    const company = await prisma.company.findUnique({
      where: { pubKey: String(pubKey) },
      include: {
        issuedCertificates: true,
        receivedCertificates: true,
        sellingTransactions: true,
        buyingTransactions: true,
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const transactions = [
      ...company.sellingTransactions,
      ...company.buyingTransactions,
      ...company.issuedCertificates,
      ...company.receivedCertificates,
    ];

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
