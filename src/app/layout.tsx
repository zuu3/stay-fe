import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStyle from "@/styles/GlobalStyle";

export const metadata: Metadata = {
  title: {
    default: "STAY — FiveM 서버",
    template: "%s | STAY"
  },
  description: "STAY FiveM 서버 공식 웹사이트 - 2026, 새롭게 돌아오는 최고의 롤플레이 환경을 경험하세요.",
  keywords: ["FiveM", "파이브엠", "STAY서버", "STAY", "GTA5 서버", "롤플레이", "사전예약", "게임"],
  authors: [{ name: "STAY Team" }],
  creator: "STAY Team",
  publisher: "STAY Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://stay-server.kr", // 실제 배포될 URL로 수정 필요
    title: "STAY — FiveM 서버",
    description: "2026, 새롭게 돌아오는 STAY FiveM 서버 공식 웹사이트입니다.",
    siteName: "STAY",
    images: [
      {
        url: "/assets/og-image.png", // OG 이미지 경로 (준비 필요)
        width: 1200,
        height: 630,
        alt: "STAY FiveM Server Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STAY — FiveM 서버",
    description: "2026, 새롭게 돌아오는 STAY FiveM 서버 공식 웹사이트",
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <GlobalStyle />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
