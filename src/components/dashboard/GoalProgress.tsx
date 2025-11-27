"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Transaction, BudgetGoal } from "@/types";

interface GoalProgressProps {
    transactions: Transaction[];
    budgetGoals: BudgetGoal[];
}

export function GoalProgress({ transactions, budgetGoals }: GoalProgressProps) {
    // Calculate current amount for each goal based on transactions
    // Assuming goals are monthly income goals per category
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

    // Calculate total earnings and total goal for the month
    const totalEarnings = updatedGoals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    const totalGoal = updatedGoals.reduce((acc, goal) => acc + goal.targetAmount, 0);

    // Data for the pie chart
    const data = [
        { name: 'Completed', value: totalEarnings },
        { name: 'Remaining', value: Math.max(0, totalGoal - totalEarnings) },
    ];

    const COLORS = ['#4318FF', '#E0E5F2'];

    return (
        <div className="bg-white rounded-[2rem] p-6 h-full flex flex-col items-center justify-center">
            <h3 className="text-[#1B2559] font-bold text-xl self-start mb-4">Goal Progress</h3>

            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label
                                value={`€ ${totalEarnings.toLocaleString()}`}
                                position="center"
                                className="text-2xl font-bold fill-[#1B2559]"
                                dy={-10}
                            />
                            <Label
                                value={`Goal: € ${totalGoal.toLocaleString()}`}
                                position="center"
                                className="text-xs fill-[#A3AED0]"
                                dy={15}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-8 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-2 rounded-full bg-[#1B2559]" />
                    <span className="text-xs text-[#A3AED0]">Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-2 rounded-full bg-[#E0E5F2]" />
                    <span className="text-xs text-[#A3AED0]">Goal</span>
                </div>
            </div>
        </div>
    );
}
