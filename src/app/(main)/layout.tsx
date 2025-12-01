import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataProvider } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/server";


import { RecurringTransactionChecker } from "@/components/RecurringTransactionChecker";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <DataProvider>
            <div className="flex h-screen bg-background overflow-hidden">
                <Sidebar userEmail={user?.email} />
                <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                    <MobileNav userEmail={user?.email} />
                    <div className="h-full w-full overflow-y-auto bg-[#F4F7FE] p-4 md:p-8 lg:p-10">
                        {children}
                    </div>
                    <RecurringTransactionChecker />
                </div>
            </div>
        </DataProvider>
    );
}
