"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BudgetGoal, Transaction } from "@/types";
import { SmartCategoryDialog } from "@/components/categories/SmartCategoryDialog";
import { useState } from "react";

export function ActionButtons() {
    return (
        <div className="bg-white rounded-[2rem] p-6 h-full flex items-center justify-center">
            <Link href="/add-transaction" className="w-full">
                <Button className="w-full bg-[#4318FF] hover:bg-[#3311DD] text-white rounded-full py-4 text-base font-bold shadow-md">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Transaction
                </Button>
            </Link>
        </div>
    );
}

interface MonthlyTargetsProps {
    budgetGoals: BudgetGoal[];
    transactions: Transaction[];
}

export function MonthlyTargets({ budgetGoals, transactions }: MonthlyTargetsProps) {
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const updatedGoals = budgetGoals.map(goal => {
        const amount = transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.category === goal.category &&
                    t.type === 'Income' &&
                    date.toLocaleString('default', { month: 'long' }) === currentMonth &&
                    date.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
        return { ...goal, currentAmount: amount };
    });

    return (
        <div className="bg-white rounded-[2rem] p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#1B2559] font-bold text-xl">Monthly Targets</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-[#F4F7FE] hover:bg-[#E0E5F2]"
                    onClick={() => setIsAddGoalOpen(true)}
                >
                    <Plus className="h-4 w-4 text-[#1B2559]" />
                </Button>
            </div>
            <div className="space-y-6">
                {updatedGoals.map((goal) => (
                    <div key={goal.category} className="space-y-2">
                        <div className="flex justify-between items-center bg-[#F4F7FE] p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                    style={{ backgroundColor: goal.color + '40', color: goal.color }}
                                >
                                    {goal.category[0]}
                                </div>
                                <span className="font-bold text-[#1B2559]">{goal.category}</span>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#1B2559]">€{goal.currentAmount.toFixed(2)}</p>
                                <p className="text-xs text-[#A3AED0]">/ €{goal.targetAmount}</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`,
                                    backgroundColor: goal.color
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <SmartCategoryDialog
                open={isAddGoalOpen}
                onOpenChange={setIsAddGoalOpen}
                defaultType="Income"
            />
        </div>
    );
}
