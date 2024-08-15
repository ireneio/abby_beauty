import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import StoreProvider from "@/lib/store/provider";

const inter = Inter({ subsets: ["latin"] });

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