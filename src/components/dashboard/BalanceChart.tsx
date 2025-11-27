"use client";

import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "@/types";

interface BalanceChartProps {
    transactions: Transaction[];
}

export function BalanceChart({ transactions }: BalanceChartProps) {
    // Calculate monthly income for the last 12 months
    const data = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();

        const monthlyIncome = transactions
            .filter(t => {
                const tDate = new Date(t.date);
                return t.type === 'Income' &&
                    tDate.getMonth() === d.getMonth() &&
                    tDate.getFullYear() === year;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        data.push({ name: monthName, income: monthlyIncome });
    }

    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);

    return (
        <div className="bg-white rounded-[2rem] p-6 h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-[#1B2559] font-bold text-xl">Monthly earnings</h3>
                    <p className="text-[#05CD99] text-sm font-medium flex items-center gap-1">
                        Income <span className="text-xs">↗</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[#A3AED0] text-xs">Total (Last 12 Months)</p>
                    <p className="text-[#1B2559] font-bold text-xl">€{totalIncome.toLocaleString()}</p>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#E0E5F2" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#4318FF"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{ r: 8, fill: "#4318FF", stroke: "white", strokeWidth: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
