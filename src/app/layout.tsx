"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import { ApolloCacheClient } from "@/utils/cache";
import { useMemo } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create an instance, not a function
  const apolloCache = useMemo(() => new ApolloCacheClient(), []);

  return (
    <html lang="en">
      <ApolloProvider client={apolloCache.getClient()}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </ApolloProvider>
    </html>
  );
}
