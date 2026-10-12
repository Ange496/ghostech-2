import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, B612, Roboto, Geist } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import ConditionalLayout from "@/src/composants/mise-en-page/ConditionalLayout";
import { cn } from "@/src/utilitaires/cn";

const MAINTENANCE_MODE = false;

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const b612 = B612({
  variable: "--font-b612",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ghostech-afrique.web.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ghostech — Communauté & Hub d'Innovation Tech en Afrique",
    template: "%s | Ghostech Afrique",
  },
  description:
    "Ghostech est l'organisation phare d'innovation technologique en Afrique. Formations, hackathons, accompagnement de projets et développement des compétences numériques du continent.",
  keywords: [
    "Ghostech",
    "Tech Afrique",
    "Innovation Côte d'Ivoire",
    "Hackathons Afrique",
    "Formations Tech Abidjan",
    "Développement Web Mobile",
    "Cyber-sécurité",
    "Intelligence Artificielle",
    "DevArena",
    "Startups Africaines",
  ],
  authors: [{ name: "Ghostech Team", url: SITE_URL }],
  creator: "Ghostech",
  publisher: "Ghostech Afrique",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Ghostech — Hub d'Innovation & Formations Tech en Afrique",
    description:
      "Construire. Impacter. Conquérir. Rejoignez la communauté des développeurs, créateurs et innovateurs africains.",
    url: SITE_URL,
    siteName: "Ghostech Afrique",
    images: [
      {
        url: `${SITE_URL}/header_photo/4KK.png`,
        width: 1200,
        height: 630,
        alt: "Ghostech Afrique — Innovation Tech",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghostech Afrique — Hub d'Innovation Tech",
    description: "Formations, hackathons et projets tech à fort impact en Afrique.",
    images: [`${SITE_URL}/header_photo/4KK.png`],
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fd800a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ghostech Afrique",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: "Organisation d'innovation technologique, formations et hackathons en Afrique.",
    sameAs: [
      "https://lnkd.in/edXVXbH8",
      "https://www.tiktok.com/@ghostech00",
      "https://chat.whatsapp.com/Le6R6EvCKOR8I3kmQEd9XS",
      "https://facebook.com",
    ],
  };

  if (MAINTENANCE_MODE) {
    return (
      <html
        lang="fr"
        className={cn("h-full", "antialiased", dmSans.variable, b612.variable, roboto.variable, "font-sans", geist.variable)}
      >
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        </head>
        <body className="min-h-full flex flex-col font-sans text-white bg-slate-950 relative">
          <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_40%,_#082f49_100%)] px-6">
            <div className="text-center max-w-2xl">
              <p className="text-sm uppercase tracking-[0.5em] text-cyan-300 mb-4">Ghostech</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Site en construction</h1>
              <p className="text-lg md:text-xl text-slate-200">
                Nous travaillons actuellement sur la plateforme. Revenez bientôt.
              </p>
            </div>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", dmSans.variable, b612.variable, roboto.variable, "font-sans", geist.variable)}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh w-full max-w-full overflow-x-hidden flex flex-col font-sans text-[#357dab] bg-white relative">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}
