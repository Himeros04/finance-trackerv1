"use client";

import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ExpenseTreasuryChart() {
    const { transactions } = useData();

    const expenseTransactions = transactions.filter(t => t.type === 'Expense');

    const toPay = expenseTransactions
        .filter(t => t.status === 'À payer')
        .reduce((sum, t) => sum + t.amount, 0);

    const paid = expenseTransactions
        .filter(t => t.status === 'Payé')
        .reduce((sum, t) => sum + t.amount, 0);

    const data = [
        { name: 'À payer', amount: toPay, color: '#FFB547' }, // Orange/Yellow
        { name: 'Payé', amount: paid, color: '#05CD99' },   // Green
    ];

    return (
        <Card className="rounded-[20px] border-none shadow-sm h-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1B2559]">Trésorerie Dépenses</CardTitle>
                <p className="text-sm text-gray-500">Aperçu des dépenses à payer vs payées</p>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#A3AED0', fontSize: 12 }}
                                width={60}
                            />
                            <Tooltip
                                formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between items-center px-4">
                    <div>
                        <p className="text-sm text-gray-500">Total À payer</p>
                        <p className="text-2xl font-bold text-[#FFB547]">
                            {toPay.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Payé</p>
                        <p className="text-xl font-bold text-[#05CD99]">
                            {paid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
