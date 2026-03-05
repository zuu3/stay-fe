import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import LayoutBody from "@/components/LayoutBody";
import GlobalStyle from "@/styles/GlobalStyle";

export const metadata: Metadata = {
  metadataBase: new URL("https://stayrp.kro.kr"),
  title: {
    default: "STAY RP",
    template: "%s | STAY"
  },
  description: "STAY 서버 공식 홈페이지",
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
    url: "https://stayrp.kro.kr",
    title: "STAY RP",
    description: "STAY 서버 공식 홈페이지",
    siteName: "STAY RP",
    images: [
      {
        url: "/assets/banner.gif",
        width: 700,
        height: 394,
        alt: "STAY RP Server Banner",
        type: "image/gif",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STAY RP",
    description: "STAY 서버 공식 홈페이지",
    images: ["/assets/banner.gif"],
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
      <head>
        <meta name="google-site-verification" content="I9kILbt0mCrmVYMAI9GgSzYAPnfBJrPBalDsqpPuMEU" />
        <meta name="naver-site-verification" content="6162691bc4b776a2c645c60d2c27608e9054c283" />
      </head>
      <body>
        <Providers>
          <GlobalStyle />
          <Header />
          <LayoutBody>{children}</LayoutBody>
        </Providers>
      </body>
    </html>
  );
}
