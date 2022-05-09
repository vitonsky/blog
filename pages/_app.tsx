import type { AppProps } from "next/app";
import Head from "next/head";

import { siteInfo } from "../lib/constants";

import { MainLayout } from "../components/MainLayout/MainLayout";

import 'highlight.js/styles/github.css';
import "../styles/app.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Head>
        <title>{siteInfo.title}</title>
      </Head>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default App;
