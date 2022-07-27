import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';

import Head from 'next/head';
import { AppProps } from 'next/app';

import { theme } from '../layout/theme'


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const isBrowser = typeof document !== 'undefined';

function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = createEmotionCache(), pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
