import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
import { Locale, getDictionary } from "@/localization";
import { Providers } from "@/components/providers/providers";
import Navbar from "@/components/navbar";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const materialSymbols = localFont({
  variable: '--font-family-symbols',
  style: 'normal',
  src: '../../../node_modules/material-symbols/material-symbols-rounded.woff2', // A reference to the woff2 file from NPM package "material-symbols"
  display: 'block',
  weight: '100 700',
})

export const metadata: Metadata = {
  title: "MSU ACM",
  description: "The Murray State ACM student organization.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {
    lang: Locale
  }
}>) {
  const locale = params.lang
  const langDict = await getDictionary(locale)
  const session = await getActiveSession(cookies())

  return (
    <html lang={locale} className={`${inter.variable} ${materialSymbols.variable}`}>
      <body className="bg-background">
        <Providers dictionary={langDict}>
          {/* Nav bar */}
          <Navbar lang={locale} user={session ? session.user : null}/>

          {/* Main page content */}
          <main className="max-w-[1920px] min-h-screen m-auto flex flex-col justify-start items-center px-5 py-6 box-border">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
