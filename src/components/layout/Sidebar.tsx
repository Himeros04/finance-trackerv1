"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/actions/auth";


import { NAV_ITEMS } from "@/constants/navigation";

interface SidebarProps {
    userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-full bg-background p-6 border-r border-transparent dark:border-border">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-12">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-card shadow-sm flex items-center justify-center bg-muted dark:bg-card">
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
                <h2 className="text-lg font-bold text-foreground">Finance Tracker</h2>
                <p className="text-sm text-muted-foreground">by Hoptisens</p>
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
                                    ? "bg-card text-foreground shadow-sm border-r-4 border-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-inherit")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-2">
                <div className="px-4 mb-2">

                </div>
                {userEmail && (
                    <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-bold text-foreground">
                            {userEmail.split('@')[0]}
                        </p>
                    </div>
                )}
                <button
                    onClick={() => signout()}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive transition-colors font-medium"
                >
                    <LogOut className="w-6 h-6" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
