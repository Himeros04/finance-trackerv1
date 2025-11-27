import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The H - Finance Tracker",
  description: "Finance Tracker Application",
};

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataProvider } from "@/context/DataContext";

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <DataProvider>
          <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
            <Sidebar userEmail={user?.email} />
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden">
              <MobileNav />
              <main className="flex-1 p-4 md:p-8 lg:p-10">
                {children}
              </main>
            </div>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
