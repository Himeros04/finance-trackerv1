import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HeroCardProps {
    transactions: Transaction[];
}

export function HeroCard({ transactions }: HeroCardProps) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.toLocaleString('default', { month: 'long' }) === currentMonth &&
            date.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = currentMonthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    return (
        <div className="bg-[#C3D5F9] rounded-[2.5rem] p-8 relative overflow-hidden h-full flex flex-col justify-between">
            {/* Background decoration could go here */}

            <div className="flex justify-between items-start z-10">
                <span className="text-[#707EAE] font-medium text-lg">CashFlow - {currentMonth} {currentYear}</span>
            </div>

            <div className="flex flex-col items-center justify-center z-10 my-4">
                <h1 className="text-5xl font-bold text-[#1B2559] mb-8">€ {balance.toFixed(2)}</h1>

                <div className="flex gap-12 w-full justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#05CD99]/20 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-[#05CD99]" />
                        </div>
                        <div>
                            <p className="text-[#1B2559] font-bold text-lg">€ {income.toFixed(2)}</p>
                            <p className="text-[#A3AED0] text-xs">Money IN</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E60000]/10 flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-[#E60000]" />
                        </div>
                        <div>
                            <p className="text-[#1B2559] font-bold text-lg">€ {expense.toFixed(2)}</p>
                            <p className="text-[#A3AED0] text-xs">Money OUT</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end z-10">
                <span className="font-bold text-[#1B2559] text-xl tracking-widest">VISA</span>
            </div>
        </div>
    );
}
