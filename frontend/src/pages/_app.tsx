import * as React from 'react';
import Head from 'next/head';
import { type AppProps } from 'next/app';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import theme from '@/styles/theme';
import createEmotionCache from '@/styles/createEmotionCache';
import RootLayout from '@/components/layout/RootLayout';
import DisclaimerDialog from '@/components/DisclaimerDialog';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Prevents public dev environment from being indexed by search engines */}
        {process.env.NEXT_PUBLIC_ENVIRONMENT !== 'prod' && <meta name="robots" content="noindex" />}
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''} />
        <DisclaimerDialog />
      </ThemeProvider>
    </CacheProvider>
  );
}
