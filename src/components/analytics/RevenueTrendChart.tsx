"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from "@/context/DataContext";

export function RevenueTrendChart() {
    const { cashflowMetrics } = useData();

    // Prepare data: Add 'cashflow' property
    // cashflowMetrics is sorted descending by date in DataContext, so we reverse for chart (left to right)
    const data = [...cashflowMetrics].reverse().map(m => ({
        ...m,
        cashflow: m.income - m.expense
    }));

    return (
        <div className="bg-white rounded-[20px] p-6 h-full shadow-sm">
            <h3 className="text-[#1B2559] font-bold text-lg mb-4">Revenue & Cashflow Trend</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="income"
                            name="Revenue"
                            stroke="#4318FF"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#4318FF", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="cashflow"
                            name="CashFlow"
                            stroke="#05CD99"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#05CD99", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
