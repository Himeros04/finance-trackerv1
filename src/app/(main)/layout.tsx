import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataProvider } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/server";

import { SwipeableLayout } from "@/components/layout/SwipeableLayout";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <DataProvider>
            <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
                <Sidebar userEmail={user?.email} />
                <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                    <MobileNav userEmail={user?.email} />
                    <SwipeableLayout>
                        {children}
                    </SwipeableLayout>
                </div>
            </div>
        </DataProvider>
    );
}
