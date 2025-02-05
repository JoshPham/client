import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});


export const metadata: Metadata = {
  title: "Materialism and \"Happiness\"",
  description: "Made by Josh Pham for AP Lang Synthesis Presentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"
      suppressHydrationWarning={true}
    >
      <body
        className={`${playfair.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
