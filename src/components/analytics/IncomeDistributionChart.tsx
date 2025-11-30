"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from "@/context/DataContext";

interface IncomeDistributionChartProps {
    selectedMonth: string;
}

export function IncomeDistributionChart({ selectedMonth }: IncomeDistributionChartProps) {
    const { transactions, budgetGoals } = useData();

    // Calculate total income per category
    const categoryTotals: Record<string, number> = {};
    let totalIncome = 0;

    transactions.filter(t => {
        if (t.type !== 'Income') return false;
        const date = new Date(t.date);
        const month = date.toLocaleString('en-US', { month: 'long' });
        return month === selectedMonth;
    }).forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalIncome += t.amount;
    });

    // Prepare data for chart
    const data = Object.entries(categoryTotals)
        .map(([name, value]) => {
            // Find color from budget goals or generate one
            const goal = budgetGoals.find(g => g.category === name);
            const color = goal?.color || '#A3AED0'; // Default color
            return { name, value, color };
        })
        .sort((a, b) => b.value - a.value); // Sort by value desc

    // State for tooltip position
    const [tooltipPos, setTooltipPos] = useState<{ x: number, y: number } | undefined>(undefined);
    // Ref to store geometry data from labels
    const geometryRef = React.useRef<{ cx: number; cy: number; angles: number[] }>({ cx: 0, cy: 0, angles: [] });

    // Custom Label with Line
    const renderCustomizedLabel = (props: any) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, index } = props;

        // Store geometry data
        geometryRef.current.cx = cx;
        geometryRef.current.cy = cy;
        geometryRef.current.angles[index] = midAngle;

        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill} fontSize={12} fontWeight="bold" dy={-5}>
                    {`${(percent * 100).toFixed(1)}%`}
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={12} textAnchor={textAnchor} fill="#333" fontSize={11}>
                    {payload.name}
                </text>
            </g>
        );
    };

    const onPieEnter = (_: any, index: number) => {
        const { cx, cy, angles } = geometryRef.current;
        const midAngle = angles[index];
        if (midAngle === undefined) return;

        const RADIAN = Math.PI / 180;
        // Position tooltip further out than the labels (radius 80 + 30 for label line + extra)
        // Or maybe just enough to clear the chart. 
        // Let's put it at radius 120 (80 + 40)
        const radius = 120;
        const x = cx + radius * Math.cos(-RADIAN * midAngle);
        const y = cy + radius * Math.sin(-RADIAN * midAngle);

        setTooltipPos({ x, y });
    };

    return (
        <div className="bg-white rounded-[20px] p-6 h-full shadow-sm">
            <h3 className="text-[#1B2559] font-bold text-lg mb-4">Income Distribution</h3>
            <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            content={<CustomTooltip totalIncome={totalIncome} />}
                            position={tooltipPos}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-xs text-[#A3AED0]">Total</p>
                    <p className="text-lg font-bold text-[#1B2559]">€ {totalIncome.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, totalIncome }: any) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0].payload;
        const percent = ((value / totalIncome) * 100).toFixed(1);
        return (
            <div className="bg-white p-3 rounded-xl shadow-lg border-none">
                <p className="font-bold text-[#1B2559]">{name}</p>
                <p className="text-[#05CD99]">€ {value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{percent}%</p>
            </div>
        );
    }
    return null;
};
