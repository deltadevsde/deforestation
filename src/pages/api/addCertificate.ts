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

  const {
    id,
    name,
    issuingCompanyPubKey,
    receivingCompanyPubKey,
    amount,
    area,
    validated,
  } = req.body;

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

    const dataBody = {
      name,
      issuingCompanyId: issuingCompanyPubKey,
      receivingCompanyId: receivingCompanyPubKey,
      validityStart: currentDate,
      validityEnd: expirationDate,
      amount,
      area,
    };

    if (id) {
      const company = await prisma.company.update({
        where: { pubKey: receivingCompanyPubKey },
        data: {
          transactions: {
            push: JSON.stringify({
              id,
              ...dataBody,
              validated: false,
            }),
          },
        },
      });
      res.status(200).json(company);
      return;
    }

    const createdCertificate = await prisma.certificate.create({
      data: dataBody,
    });

    const dataBodyWithId = {
      id: createdCertificate.id,
      ...dataBody,
      validated: true,
    };

    const company = await prisma.company.update({
      where: { pubKey: issuingCompanyPubKey },
      data: {
        transactions: {
          push: JSON.stringify(dataBodyWithId),
        },
      },
    });
    res.status(201).json(createdCertificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
