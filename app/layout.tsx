import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "Survey Kit – Mobile-first, Accessible Survey Framework",
  description:
    "Survey Kit boosts survey participation with mobile-first conversational UI, one question per page for clarity, accessible (WCAG 2.2 AA) components, and developer-friendly React + JSON/YAML configuration. Built by github.com/survey-kit and github.com/sebtheo.",
  openGraph: {
    title: "Survey Kit – Mobile-first, Accessible Survey Framework",
    description:
      "Survey Kit boosts survey participation with mobile-first conversational UI, one question per page, accessible (WCAG 2.2 AA) components, and developer-friendly setup.",
    url: "https://github.com/survey-kit",
    siteName: "Survey Kit",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Survey Kit – Mobile-first, Accessible Survey Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Survey Kit – Mobile-first, Accessible Survey Framework",
    description:
      "Mobile-first conversational survey UI. One question per page. Accessible and developer friendly.",
    creator: "@sebtheo",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://github.com/survey-kit"),
  keywords: [
    "Survey Kit",
    "React",
    "Next.js",
    "Mobile-first",
    "Accessible",
    "WCAG 2.2 AA",
    "Conversational UI",
    "Survey framework",
    "Developer friendly",
    "Open Source",
    "JSON",
    "YAML",
    "github.com/survey-kit",
    "github.com/sebtheo",
  ],
  authors: [
    { name: "Sebastian Theo", url: "https://github.com/sebtheo" },
    { name: "Survey Kit", url: "https://github.com/survey-kit" },
  ],
  alternates: {
    canonical: "https://github.com/survey-kit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Primary SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Social */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Survey Kit – Mobile-first, Accessible Survey Framework"
        />
        <meta
          property="og:description"
          content="Survey Kit boosts survey participation with mobile-first conversational UI, one question per page, accessible (WCAG 2.2 AA) components, and developer-friendly setup."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta
          property="og:image:alt"
          content="Survey Kit – Mobile-first, Accessible Survey Framework"
        />
        <meta property="og:url" content="https://github.com/survey-kit" />
        <meta property="og:site_name" content="Survey Kit" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Survey Kit – Mobile-first, Accessible Survey Framework"
        />
        <meta
          name="twitter:description"
          content="Mobile-first conversational survey UI. One question per page. Accessible and developer friendly."
        />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:creator" content="@sebtheo" />
        {/* Schema.org / JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Survey Kit",
              url: "https://github.com/survey-kit",
              author: [
                {
                  "@type": "Person",
                  name: "Sebastian Theo",
                  url: "https://github.com/sebtheo",
                },
                {
                  "@type": "Organization",
                  name: "Survey Kit",
                  url: "https://github.com/survey-kit",
                },
              ],
              description:
                "Survey Kit boosts survey participation with mobile-first conversational UI, one question per page, accessible (WCAG 2.2 AA) components, and developer-friendly setup.",
              applicationCategory: "Survey, Questionnaire, Accessibility",
              keywords:
                "Survey Kit,React,Next.js,Mobile-first,Accessible,WCAG 2.2 AA,Conversational UI,Survey framework,Developer friendly,Open Source,JSON,YAML,github.com/survey-kit,github.com/sebtheo",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
