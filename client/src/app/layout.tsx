import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOCITEC | Sociedad Científica de Ingeniería de Sistemas",
  description: "Ingeniería que transforma. Ciencia que trasciende. Sociedad Científica de Ingeniería de Sistemas y Tecnología de la Universidad Autónoma Tomás Frías.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans pt-10">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
