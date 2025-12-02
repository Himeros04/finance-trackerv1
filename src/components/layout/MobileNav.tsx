"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, BarChart3, Settings, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signout } from "@/actions/auth";


import { NAV_ITEMS } from "@/constants/navigation";

interface MobileNavProps {
    userEmail?: string;
}

export function MobileNav({ userEmail }: MobileNavProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-background sticky top-0 z-50">
            <div className="font-bold text-foreground">The H - Finance</div>
            <div className="flex items-center gap-2">

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6 text-foreground" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-background w-72 p-6 flex flex-col h-full border-r border-transparent dark:border-border">
                        <div className="flex flex-col items-center mb-8 mt-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white dark:border-card shadow-sm flex items-center justify-center bg-muted dark:bg-card">
                                <Image
                                    src="/user-profile.png"
                                    alt="User Profile"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain p-1.5"
                                    priority
                                />
                            </div>
                            <h2 className="text-base font-bold text-foreground">The H – Finance Tracker</h2>
                        </div>
                        <nav className="flex flex-col space-y-2 flex-1">
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
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
