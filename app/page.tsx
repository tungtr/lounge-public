'use client';

// Essentials
import dynamic from 'next/dynamic';

// Components - Relative
const HomePage = dynamic(() => import('@components/pages/HomePage'), {
  ssr: false
});

const Root = () => {
  return <HomePage />;
};

export default Root;