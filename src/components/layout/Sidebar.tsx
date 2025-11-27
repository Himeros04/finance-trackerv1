"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/actions/auth";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: Layers },
    { label: "Revenue analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
];



interface SidebarProps {
    userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-full bg-[#F4F7FE] p-6 border-r border-transparent">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-12">
                {/* Ajout de bg-white ou autre couleur de fond si l'image a de la transparence */}
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm flex items-center justify-center bg-gray-100">
                    {/* User Profile Image */}
                    <Image
                        src="/user-profile.png"
                        alt="User Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain p-2"
                        priority
                    />
                </div>
                <h2 className="text-lg font-bold text-[#1B2559]">Finance Tracker</h2>
                <p className="text-sm text-[#A3AED0]">by Hoptisens</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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

            {/* Bottom Actions */}
            <div className="mt-auto space-y-2">
                {userEmail && (
                    <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-bold text-[#1B2559]">
                            {userEmail.split('@')[0]}
                        </p>
                    </div>
                )}
                <button
                    onClick={() => signout()}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#A3AED0] hover:text-[#E60000] transition-colors font-medium"
                >
                    <LogOut className="w-6 h-6" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
