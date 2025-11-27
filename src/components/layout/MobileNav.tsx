"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, BarChart3, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: Layers },
    { label: "Revenue analytics", href: "/analytics", icon: BarChart3 },
    { label: "Setting", href: "/settings", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#F4F7FE] sticky top-0 z-50">
            <div className="font-bold text-[#1B2559]">The H - Finance</div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6 text-[#2B3674]" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#F4F7FE] w-72 p-6">
                    <div className="flex flex-col items-center mb-8 mt-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm flex items-center justify-center bg-gray-100">
                            <img
                                src="/user-profile.png"
                                alt="User Profile"
                                className="w-full h-full object-contain p-1.5"
                            />
                        </div>
                        <h2 className="text-base font-bold text-[#1B2559]">The H – Finance Tracker</h2>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium",
                                        isActive
                                            ? "bg-white text-[#2B3674] shadow-sm border-r-4 border-[#4318FF]"
                                            : "text-[#A3AED0] hover:text-[#2B3674] hover:bg-white/50"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6", isActive ? "text-[#4318FF]" : "text-inherit")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
