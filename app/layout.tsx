import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallBanner } from "@/components/ui/InstallBanner";

const playfair = Playfair_Display({ subsets: ["latin","cyrillic"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin","cyrillic"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Antiqua — Оценка антиквариата", template: "%s | Antiqua" },
  description: "Узнайте стоимость находки. Загрузите фото — сравним с реальными аукционными продажами.",
  keywords: ["оценка антиквариата","аукционные цены","antique appraisal","блошиный рынок"],
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Antiqua" },
  openGraph: {
    type: "website", title: "Antiqua", description: "Ваша находка может стоить целое состояние.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1812",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Antiqua" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-antiqua-bg text-antiqua-coal antialiased">
        <InstallBanner />
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
