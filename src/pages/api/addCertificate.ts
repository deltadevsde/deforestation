import { Company, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function addCertificateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, issuingCompanyPubKey, receivingCompanyPubKey, amount } =
    req.body;

  try {
    const issuingCompany: Company | null = await prisma.company.findUnique({
      where: { pubKey: issuingCompanyPubKey },
    });

    const receivingCompany: Company | null = await prisma.company.findUnique({
      where: { pubKey: receivingCompanyPubKey },
    });

    if (!issuingCompany || !receivingCompany) {
      return res.status(404).json({ message: 'Not Found' });
    }

    const currentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate() + 56); // Einfach mal auf heute in 8 Wochen = 56 Tage setzen

    const createdCertificate = await prisma.certificate.create({
      data: {
        name,
        issuingCompany: { connect: { id: issuingCompany.id } },
        receivingCompany: { connect: { id: receivingCompany.id } },
        validityStart: currentDate,
        validityEnd: expirationDate,
        amount,
      },
    });

    res.status(201).json(createdCertificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
