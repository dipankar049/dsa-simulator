import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "DSA Simulator", template: "%s | DSA Simulator" },
  description: "Interactive visual simulator for learning data structures and algorithms.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "DSA Simulator",
    description: "Interactive visual simulator for learning data structures and algorithms.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Simulator",
    description: "Interactive visual simulator for learning data structures and algorithms.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('dsa-simulator-theme') || 'dark';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}