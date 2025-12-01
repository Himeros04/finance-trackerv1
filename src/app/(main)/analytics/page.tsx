"use client";

import { useState } from "react";
import { CashflowCards } from "@/components/analytics/CashflowCards";
import { RevenueTrendChart } from "@/components/analytics/RevenueTrendChart";
import { IncomeDistributionChart } from "@/components/analytics/IncomeDistributionChart";
import { IncomeTreasuryChart } from "@/components/analytics/IncomeTreasuryChart";
import { ExpenseTreasuryTable } from "@/components/analytics/ExpenseTreasuryTable";

export default function AnalyticsPage() {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>

            <div className="mb-8">
                <CashflowCards selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[400px]">
                <RevenueTrendChart />
                <IncomeDistributionChart selectedMonth={selectedMonth} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Trésorerie</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IncomeTreasuryChart selectedMonth={selectedMonth} />
                    <ExpenseTreasuryTable selectedMonth={selectedMonth} />
                </div>
            </div>
        </div>
    );
}
