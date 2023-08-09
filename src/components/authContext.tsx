import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useState } from 'react';

import { getTransactions } from '@/lib/helper';

export interface Company {
  id: string;
  name: string;
  purpose: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  street: string;
  city: string;
  provence: string;
  zip: string;
  pubKey: string;
  privKey: string;
  canIssueCertificates: boolean;
  transactions: (Transaction | Certificate)[];
}

export interface Certificate {
  id: string;
  name: string;
  amount: number;
  area: string;
  issuingCompanyId: string;
  receivingCompanyId: string;
  validityStart?: Date;
  validityEnd?: Date;
  validated: boolean;
}

export interface Transaction {
  id: string;
  sellerPubKey: string;
  buyerPubKey: string;
  certificateId: string;
  sellingId: string;
  amount: number;
  validated: boolean;
}

// Duck typing
export function isCertificate(obj: any): obj is Certificate {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.issuingCompanyId === 'string' &&
    typeof obj.receivingCompanyId === 'string'
  );
}

export const isTransaction = (obj: any): obj is Transaction => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.sellerPubKey === 'string' &&
    typeof obj.buyerPubKey === 'string' &&
    typeof obj.certificateId === 'string' &&
    typeof obj.amount === 'number'
  );
};

interface AuthContextType {
  company: Company | null;
  transactions: (Transaction | Certificate)[];
  login: ({ email, password }: { email: string; password: string }) => void;
  logout: () => void;
  fetchTransactions: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [transactions, setTransactions] = useState<
    (Transaction | Certificate)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { push } = useRouter();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());
      if (response.company) {
        setCompany(response.company);
        push('/transparency-dict');
      } else {
        alert('Fehler beim Einloggen:');
      }
    } catch (error) {
      console.error('Fehler beim Einloggen:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (!company) {
        return;
      }
      getTransactions(company.pubKey)
        .then((response) => {
          if (!response.ok) {
            setTransactions([]);
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data.transactions.length > 0) {
            const transactions = data.transactions.map((transaction: string) =>
              JSON.parse(transaction)
            );
            setTransactions(transactions);
          } else {
            setTransactions(data.transactions);
          }
        });
    } catch (error) {
      console.error('Fehler beim Laden der Transaktionen:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCompany(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider
      value={{ company, transactions, login, logout, fetchTransactions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
