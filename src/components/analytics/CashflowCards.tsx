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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cashflowMetrics.map((metric, index) => (
                <div
                    key={metric.month}
                    onClick={() => onSelectMonth(metric.month)}
                    className={`bg-white rounded-[2rem] p-6 cursor-pointer transition-all border-2 ${selectedMonth === metric.month
                            ? 'border-[#4318FF] shadow-lg scale-[1.02]'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-[#1B2559] font-bold text-lg">{metric.month}</h3>
                        {selectedMonth === metric.month && (
                            <Badge className="bg-[#E6FBF5] text-[#05CD99] hover:bg-[#E6FBF5] rounded-full px-3 py-1 shadow-none">
                                Active
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[#A3AED0] text-xs mb-1">Total Income</p>
                            <p className="text-[#05CD99] font-bold text-xl">€ {metric.income.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[#A3AED0] text-xs mb-1">Total Expenses</p>
                            <p className="text-[#E60000] font-bold text-xl">- € {metric.expense.toLocaleString()}</p>
                        </div>
                        <div className="pt-4 border-t border-[#E0E5F2]">
                            <p className="text-[#A3AED0] font-bold text-sm">
                                Net: <span className="text-[#1B2559]">{metric.income - metric.expense >= 0 ? '+' : ''} € {(metric.income - metric.expense).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
