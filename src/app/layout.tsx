"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/utils/apollo-client";
// adjust path as needed

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

// Create the client instance
const client = createApolloClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
