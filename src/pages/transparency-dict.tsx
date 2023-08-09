import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import TransparencyDashboard from '@/components/TransparencyDashboard';

export default function TransparencyDict() {
  return (
    <Layout>
      <Seo templateTitle='SINE Transparency Dictionary' />
      <TransparencyDashboard />
    </Layout>
  );
}
