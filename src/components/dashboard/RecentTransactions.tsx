import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const recent = transactions.slice(0, 4);

    return (
        <div className="bg-white rounded-[2rem] p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#1B2559] font-bold text-xl">Transactions</h3>
            </div>

            <div className="space-y-4">
                {recent.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center">
                                {t.type === 'Income' ? (
                                    <ArrowUpRight className="w-5 h-5 text-[#1B2559]" />
                                ) : (
                                    <ArrowDownRight className="w-5 h-5 text-[#1B2559]" />
                                )}
                            </div>
                            <div>
                                <p className="text-[#1B2559] font-bold">{t.entityName}</p>
                                <p className="text-[#A3AED0] text-xs">{t.category}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#1B2559] font-bold">€ {t.amount}</p>
                            <p className="text-[#A3AED0] text-xs">{t.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
