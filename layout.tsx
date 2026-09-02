import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/components/LanguageProvider";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Quero. | Curiosity Answered.",
    template: "%s | Quero.",
  },

  description:
    "Ask better questions. Follow ideas further. Curiosity answered.",

  applicationName: "Quero",

  authors: [
    {
      name: "The Ace Base",
    },
  ],

  creator: "The Ace Base",
  publisher: "The Ace Base",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    title: "Quero. | Curiosity Answered.",
    description:
      "Ask better questions. Follow ideas further. Curiosity answered.",
    siteName: "Quero.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Quero. | Curiosity Answered.",
    description:
      "Ask better questions. Follow ideas further. Curiosity answered.",
  },

  category: "technology",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body>
        <LanguageProvider />
        {children}
      </body>
    </html>
  );
}