'use client';

// Essentials
import dynamic from 'next/dynamic';

// Components - Relative
const UsersPage = dynamic(() => import('@components/pages/UsersPage'), {
  ssr: false
});

const Root = () => {
  return <UsersPage />;
};

export default Root;