import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "Note Taker",
  description: "AI Note Taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Header/>
          <div className="flex min-h-screen">
              {/* SideBar */}
              <Sidebar/>

            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
            {children}
            </div>
          </div>
          <Toaster position="top-center"/>
      </body>
    </html>
    </ClerkProvider>
  );
}
