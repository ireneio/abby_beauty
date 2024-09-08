import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import StoreProvider from "@/lib/store/provider";

import "@/styles/globals.css";

import 'react-quill/dist/quill.snow.css';

const inter = Inter({ subsets: ["latin"], weight: "700" });

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const { session } = pageProps
  return (
    <StoreProvider>
      <SessionProvider session={session}>
        <main className={`${inter.className}`}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </StoreProvider>
  )
}