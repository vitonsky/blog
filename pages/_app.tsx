import type { AppProps } from "next/app";
import Head from "next/head";

import { siteInfo } from "../lib/constants";

import { MainLayout } from "../components/MainLayout/MainLayout";

import "../styles/fonts.css";
import "../styles/app.css";

import 'highlight.js/styles/github.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Head>
        <title>{siteInfo.title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default App;
