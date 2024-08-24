import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import StoreProvider from "@/lib/store/provider";

import "@/styles/globals.css";

import 'react-quill/dist/quill.snow.css';
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const { session } = pageProps
  return (
    <StoreProvider>
      <SessionProvider session={session}>
        <Head>
          <title>艾比美容工作室</title>
          <meta name="description" content={`艾比美容工作室 | 克麗緹娜`} />
          <meta property="og:title" content={"艾比美容工作室"} />
          <meta property="og:description" content={`艾比美容工作室 | 克麗緹娜`} />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`} />
          <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="艾比美容工作室"/>
          <meta property="twitter:card" content={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`} />
          <meta name="twitter:title" content={"艾比美容工作室"} />
          <meta name="twitter:description" content={`艾比美容工作室 | 克麗緹娜`} />
          <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`} />
          {/* <meta name="twitter:site" content="@yourtwitterhandle" />
          <meta name="twitter:creator" content="@creatorhandle" /> */}
        </Head>
        <main className={`${inter.className}`}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </StoreProvider>
  )
}