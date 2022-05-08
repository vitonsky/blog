import type { AppProps } from "next/app";

import { MainLayout } from "../components/MainLayout/MainLayout";

import "../styles/app.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default App;
