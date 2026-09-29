import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOWBOX - Curated Gifts for Every Occasion",
  description: "Handcrafted with love. Curated gifts for every moment. From birthdays to anniversaries, find the perfect expression of your feelings.",
  icons: {
    icon: "/logo-circle.jpg", // This links exactly to your uploaded logo!
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-[#fdfdcb] text-black"
      >
        {children}
      </body>
    </html>
  );
}