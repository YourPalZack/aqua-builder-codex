import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaBuilder",
  description: "Build your perfect aquarium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
