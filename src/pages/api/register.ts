import { Company, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

const prisma = new PrismaClient();

export default async function createCompanyHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
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
  } = req.body;

  const { publicKey: pubKey, secretKey: privKey } = sign.keyPair();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdCompany: Company = await prisma.company.create({
      data: {
        name,
        purpose,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        country,
        street,
        city,
        provence,
        zip,
        pubKey: encodeBase64(pubKey),
        privKey: encodeBase64(privKey),
      },
      include: {
        issuedCertificates: true,
        receivedCertificates: true,
        sellingTransactions: true,
        buyingTransactions: true,
      },
    });

    res.status(201).json(createdCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
