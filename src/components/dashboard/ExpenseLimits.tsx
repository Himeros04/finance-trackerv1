"use client";

import { ExpenseBudget, Transaction } from "@/types";
import { SmartCategoryDialog } from "@/components/categories/SmartCategoryDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ExpenseLimitsProps {
    expenseBudgets: ExpenseBudget[];
    transactions: Transaction[];
}

export function ExpenseLimits({ expenseBudgets, transactions }: ExpenseLimitsProps) {
    const [isAddLimitOpen, setIsAddLimitOpen] = useState(false);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const updatedBudgets = expenseBudgets.map(budget => {
        const amount = transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.category === budget.category &&
                    t.type === 'Expense' &&
                    date.toLocaleString('default', { month: 'long' }) === currentMonth &&
                    date.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, currentAmount: amount };
    });

    return (
        <div className="bg-white rounded-[2rem] p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#1B2559] font-bold text-xl">Expense Limits</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-[#F4F7FE] hover:bg-[#E0E5F2]"
                    onClick={() => setIsAddLimitOpen(true)}
                >
                    <Plus className="h-4 w-4 text-[#1B2559]" />
                </Button>
            </div>
            <div className="space-y-6">
                {updatedBudgets.map((budget) => {
                    const percentage = Math.min((budget.currentAmount / budget.amount) * 100, 100);
                    const isOverBudget = budget.currentAmount > budget.amount;

                    return (
                        <div key={budget.category} className="space-y-2">
                            <div className="flex justify-between items-center bg-[#F4F7FE] p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#1B2559] bg-white">
                                        {budget.category[0]}
                                    </div>
                                    <span className="font-bold text-[#1B2559]">{budget.category}</span>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-[#1B2559]'}`}>
                                        €{budget.currentAmount.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-[#A3AED0]">/ €{budget.amount}</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-[#4318FF]'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
                {updatedBudgets.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center">No expense budgets set.</p>
                )}
            </div>
            <SmartCategoryDialog
                open={isAddLimitOpen}
                onOpenChange={setIsAddLimitOpen}
                defaultType="Expense"
            />
        </div>
    );
}
