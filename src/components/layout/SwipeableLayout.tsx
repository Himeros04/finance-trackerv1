"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const ROUTES = ["/", "/transactions", "/analytics", "/settings"];

export function SwipeableLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    // Find current index
    const currentIndex = ROUTES.indexOf(pathname);

    // Handle Swipe
    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentIndex < ROUTES.length - 1 && currentIndex !== -1) {
            router.push(ROUTES[currentIndex + 1]);
        }

        if (isRightSwipe && currentIndex > 0) {
            router.push(ROUTES[currentIndex - 1]);
        }
    };

    // Determine animation direction based on route change
    const [direction, setDirection] = useState(0);
    const prevIndex = useRef(currentIndex);

    useEffect(() => {
        if (currentIndex !== prevIndex.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDirection(currentIndex > prevIndex.current ? 1 : -1);
            prevIndex.current = currentIndex;
        }
    }, [currentIndex]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div
            className="relative h-full w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={pathname}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute top-0 left-0 h-full w-full overflow-y-auto bg-[#F4F7FE] p-4 md:p-8 lg:p-10"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
