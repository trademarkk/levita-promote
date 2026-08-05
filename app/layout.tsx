import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Обучение промоутера LEVITA",
  description:
    "Короткий интерактивный курс для подготовки промоутера LEVITA к первой смене.",
  openGraph: {
    title: "Обучение промоутера LEVITA",
    description: "Подготовка к первой смене: правила, практика и итоговый тест.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={spectral.variable}>{children}</body>
    </html>
  );
}
