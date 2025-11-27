import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataProvider } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/server";

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
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <main className="min-h-full p-4 md:p-8 lg:p-10">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </DataProvider>
    );
}
