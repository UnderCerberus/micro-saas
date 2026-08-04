import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollGlow from "@/components/ScrollGlow";
import { WorkspaceProvider } from "@/components/Workspace";

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://micro-saas-xi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mikko｜無料で使えるWeb制作ツール（OG画像・ロゴ・AI文章生成）",
    template: "%s｜Mikko",
  },
  description:
    "ブランド素材（OG画像・ロゴ・ファビコン・QRコード）を数秒で生成し、AIでブログ記事・SNS投稿・キャッチコピーを自動生成。完全無料で使えるWebツールスイート。",
  keywords: [
    "OG画像生成",
    "ロゴ作成",
    "AI文章生成",
    "ブログ自動生成",
    "無料ツール",
    "マイクロSaaS",
  ],
  authors: [{ name: "Mikko" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mikko",
    title: "Mikko｜無料で使えるWeb制作ツール",
    description:
      "ブランド素材を数秒で生成し、AIでブログ記事・SNS投稿を自動生成。完全無料で使えるWebツールスイート。",
    locale: "ja_JP",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mikko - ブランドをゼロコストで、武器に変える。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikko｜無料で使えるWeb制作ツール",
    description:
      "ブランド素材を数秒で生成し、AIでブログ記事・SNS投稿を自動生成。完全無料で使えるWebツールスイート。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-32x32.png",
    apple: "/icon.png",
  },
  category: "Webツール",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#4a4591",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${noto.variable} ${space.variable} h-full antialiased`}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Mikko",
                  url: SITE_URL,
                  description:
                    "ブランド素材とAIコンテンツを無料で生成できるWebツールスイート",
                  inLanguage: "ja",
                },
                {
                  "@type": "Organization",
                  name: "Mikko",
                  url: SITE_URL,
                  logo: `${SITE_URL}/icon.png`,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-base text-ink">
        <ScrollGlow />
        <WorkspaceProvider>
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </WorkspaceProvider>
      </body>
    </html>
  );
}