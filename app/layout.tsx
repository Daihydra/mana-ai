import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthButton from "@/app/components/AuthButton"; // Import the new button
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mana AI",
  description: "Generate apps with the power of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-gray-800 text-white">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <Link href="/" className="text-xl font-bold">Mana AI</Link>
            <AuthButton />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}