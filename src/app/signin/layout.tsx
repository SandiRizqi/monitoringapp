
"use client"
import { SessionProvider } from "next-auth/react";
import "../../style/globals.css";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <SessionProvider>
                <body className="bg-gray-100 min-h-screen">
                    <main className="flex min-h-screen">
                        {children}
                    </main>
                </body>
            </SessionProvider>
        </html>
    );
}
