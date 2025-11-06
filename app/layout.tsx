import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Survey Kit – Mobile-First Accessible Survey Framework for Developers",
  description:
    "Survey Kit is a modern, mobile-first survey framework with a conversational UI. Each question appears one-per-page for an optimal mobile experience. Fully accessible (WCAG 2.2 AA), keyboard navigable, and screen reader friendly. Built with React and TypeScript, easily configurable using JSON or YAML. Flexible, extensible components and validation, plus comprehensive documentation for developers.",
  keywords: [
    "Survey Kit",
    "survey framework",
    "mobile survey",
    "conversational survey",
    "accessible survey",
    "WCAG 2.2 AA",
    "keyboard navigation",
    "screen reader",
    "React",
    "TypeScript",
    "JSON",
    "YAML",
    "developer friendly",
    "customisable survey",
    "survey components",
    "validation",
    "extensible",
    "documentation",
  ],
  openGraph: {
    title: "Survey Kit – Mobile-First Accessible Survey Framework for Developers",
    description:
      "A conversational, accessible survey experience with mobile-first design, WCAG 2.2 AA compliance, and developer-first flexibility.",
    url: "https://survey-kit.com",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 120,
        height: 120,
        alt: "Survey Kit – Mobile-First Accessible Survey Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Survey Kit – Mobile-First Accessible Survey Framework for Developers",
    description:
      "Conversational, accessible surveys for mobile and desktop. One question per page, WCAG compliant, developer-friendly, and fully customisable.",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://survey-kit.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="apple-mobile-web-app-title" content="Survey Kit" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Survey Kit" />
        <meta name="author" content="@sebtheo" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
