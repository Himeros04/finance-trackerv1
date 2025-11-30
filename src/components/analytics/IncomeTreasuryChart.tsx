"use client";

import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface IncomeTreasuryChartProps {
    selectedMonth: string;
}

export function IncomeTreasuryChart({ selectedMonth }: IncomeTreasuryChartProps) {
    const { transactions } = useData();

    const incomeTransactions = transactions.filter(t => {
        if (t.type !== 'Income') return false;
        const date = new Date(t.date);
        const month = date.toLocaleString('en-US', { month: 'long' });
        return month === selectedMonth;
    });

    const toBill = incomeTransactions
        .filter(t => t.status === 'To bill')
        .reduce((sum, t) => sum + t.amount, 0);

    const billed = incomeTransactions
        .filter(t => t.status === 'Billed')
        .reduce((sum, t) => sum + t.amount, 0);

    const received = incomeTransactions
        .filter(t => t.status === 'Received')
        .reduce((sum, t) => sum + t.amount, 0);

    const data = [
        { name: 'To Bill', amount: toBill, color: '#EAB308' }, // Yellow
        { name: 'Pending', amount: billed, color: '#3B82F6' }, // Blue
        { name: 'Received', amount: received, color: '#22C55E' }, // Green
    ];

    const total = toBill + billed + received;

    // Calculate dynamic ticks: 0 and the exact values of the bars
    const ticks = [0, ...data.map(d => d.amount)].sort((a, b) => a - b);
    // Remove duplicates
    const uniqueTicks = Array.from(new Set(ticks));

    return (
        <Card className="rounded-[20px] border-none shadow-sm h-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1B2559]">Income Treasury</CardTitle>
                <p className="text-sm text-gray-500">Overview of income status</p>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis
                                type="number"
                                domain={[0, 'dataMax']}
                                ticks={uniqueTicks}
                                tickFormatter={(value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                tick={{ fill: '#A3AED0', fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#A3AED0', fontSize: 12 }}
                                width={70}
                            />
                            <Tooltip
                                formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-end items-center px-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-[#1B2559]">
                            {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
