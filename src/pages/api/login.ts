import { Company, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const company: Company | null = await prisma.company.findUnique({
      where: { email },
    });

    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!(await bcrypt.compare(password, company.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
