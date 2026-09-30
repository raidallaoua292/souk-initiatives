import type { Metadata } from "next";
// Self-hosted Arabic fonts (no runtime/build dependency on Google's CDN).
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/700.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MockStoreProvider } from "@/lib/store";
import { getMockStoreSeed } from "@/lib/services";

export const metadata: Metadata = {
  metadataBase: new URL("https://souk-mubadarat.dz"),
  title: {
    default: "سوق المبادرات | منصة المبادرات المجتمعية في الجزائر",
    template: "%s | سوق المبادرات",
  },
  description:
    "سوق المبادرات هي منصة جزائرية تجمع المبادرات المجتمعية والتطوعية من كل الولايات في مكان واحد، لدعم المبادرين والمتطوعين والمساهمين.",
  keywords: [
    "مبادرات",
    "الجزائر",
    "تطوع",
    "مجتمع مدني",
    "سوق المبادرات",
    "جمعيات",
  ],
  openGraph: {
    title: "سوق المبادرات",
    description: "منصة جزائرية لاكتشاف ودعم المبادرات المجتمعية عبر كل الولايات.",
    locale: "ar_DZ",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initial data for the client-side mock store used by the dashboard.
  const storeSeed = await getMockStoreSeed();

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen flex-col bg-background font-arabic text-dark antialiased">
        <MockStoreProvider seed={storeSeed}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MockStoreProvider>
      </body>
    </html>
  );
}
