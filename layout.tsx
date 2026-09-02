import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

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
    "Quero is a new way to explore curiosity. Ask better questions, follow ideas further, and turn curiosity into understanding.",

  applicationName: "Quero",

  keywords: [
    "Quero",
    "Curiosity Answered",
    "AI",
    "questions",
    "answers",
    "knowledge",
    "learning",
    "research",
    "exploration",
  ],

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
      "Ask better questions. Follow ideas further. Turn curiosity into understanding.",
    siteName: "Quero.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Quero. | Curiosity Answered.",
    description:
      "Ask better questions. Follow ideas further. Turn curiosity into understanding.",
  },

  category: "technology",

  icons: {
    icon: "/icon.png",
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
      <body>{children}</body>
    </html>
  );
}