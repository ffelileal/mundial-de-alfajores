import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { getOrCreateDefaultCompetition } from "@/actions/competition";

export const metadata: Metadata = {
  title: "Mundial de Alfajores Argentinos 🏆🇦🇷",
  description: "La batalla definitiva por descubrir cuál es el mejor alfajor argentino entre amigos.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mundial Alfajores",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2c1409",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const competition = await getOrCreateDefaultCompetition().catch(() => null);

  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className="antialiased bg-[#fbf9f6] text-[#22150c] selection:bg-amber-200 selection:text-amber-950"
        suppressHydrationWarning
      >
        <Navbar blindTasting={competition?.blindTasting ?? false} />
        <main className="max-w-5xl mx-auto px-3.5 sm:px-6 pt-3 sm:pt-6 pb-20 md:pb-8">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
