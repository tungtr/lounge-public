'use client';

import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useServerInsertedHTML } from 'next/navigation';

import { theme } from '@utils/constants/styles/Theme';

const RootStyleRegistry = ({
  children
}: {
  children: React.ReactNode
}) => {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        theme={theme}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        {children}
      </MantineProvider>
    </CacheProvider>
  );
};

export default RootStyleRegistry;