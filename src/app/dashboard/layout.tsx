import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/widget/Siderbar";
import SessionHeader from "@/components/widget/SessionHeader";
import "../../style/globals.css"
import "maplibre-gl/dist/maplibre-gl.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monitoring System",
  description: "",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-800`}
      >
        <div className="flex h-screen w-full bg-gray-50">
          {/* Sidebar should be positioned absolutely in mobile inside its component */}
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <SessionHeader />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
