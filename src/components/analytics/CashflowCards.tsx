"use client";

import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";

interface CashflowCardsProps {
    selectedMonth: string;
    onSelectMonth: (month: string) => void;
}

export function CashflowCards({ selectedMonth, onSelectMonth }: CashflowCardsProps) {
    const { cashflowMetrics } = useData();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {cashflowMetrics.map((metric, index) => (
                <div
                    key={metric.month}
                    onClick={() => onSelectMonth(metric.month)}
                    className={`bg-card rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 cursor-pointer transition-all border-2 ${selectedMonth === metric.month
                        ? 'border-primary shadow-lg scale-[1.02]'
                        : 'border-transparent hover:border-border'
                        }`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-foreground font-bold text-base md:text-lg">{metric.month}</h3>
                        {selectedMonth === metric.month && (
                            <Badge className="bg-[#E6FBF5] text-[#05CD99] hover:bg-[#E6FBF5] rounded-full px-3 py-1 shadow-none">
                                Active
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-muted-foreground text-xs mb-1">Total Income</p>
                            <p className="text-[#05CD99] font-bold text-lg md:text-xl">€ {metric.income.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs mb-1">Total Expenses</p>
                            <p className="text-[#E60000] font-bold text-lg md:text-xl">- € {metric.expense.toLocaleString()}</p>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <p className="text-muted-foreground font-bold text-sm">
                                Net: <span className="text-foreground">{metric.income - metric.expense >= 0 ? '+' : ''} € {(metric.income - metric.expense).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
