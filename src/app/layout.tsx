import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextBudget - Gestão Financeira Pessoal",
  description:
    "Aplicativo completo para controle de finanças pessoais, com categorização de gastos, transferências entre contas e relatórios detalhados.",
  keywords: [
    "finanças",
    "controle financeiro",
    "gestão pessoal",
    "orçamento",
    "economia",
  ],
  authors: [{ name: "FineApp Team" }],
  creator: "NextBudget",
  publisher: "NextBudget",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nextbudget.com"),
  openGraph: {
    title: "NextBudget - Gestão Financeira Pessoal",
    description: "Controle suas finanças de forma simples e eficiente",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextBudget - Gestão Financeira Pessoal",
    description: "Controle suas finanças de forma simples e eficiente",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-900 text-neutral-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
