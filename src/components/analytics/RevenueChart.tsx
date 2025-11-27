"use client";

import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from "@/context/DataContext";

export function RevenueChart() {
    const { revenueData, budgetGoals, categories } = useData();

    // Get all unique categories that have revenue data or are in goals
    const allIncomeCategories = Array.from(new Set([
        ...budgetGoals.filter(g => g.targetAmount > 0).map(g => g.category),
        ...revenueData.flatMap(d => Object.keys(d).filter(k => k !== 'month'))
    ]));

    // Helper to get color for a category
    const getCategoryColor = (categoryName: string) => {
        const goal = budgetGoals.find(g => g.category === categoryName);
        return goal?.color || '#3B82F6'; // Default blue if no goal/color
    };

    const chartData = revenueData.map(item => {
        const newItem: any = { ...item };

        allIncomeCategories.forEach(categoryName => {
            const goal = budgetGoals.find(g => g.category === categoryName);
            const target = goal?.targetAmount || 0;
            const realized = Number(item[categoryName]) || 0;
            const remaining = Math.max(0, target - realized);

            newItem[`${categoryName}Realized`] = realized;
            newItem[`${categoryName}Remaining`] = remaining;
        });

        return newItem;
    });

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#A3AED0', fontSize: 12 }}
                        dy={10}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '20px' }}
                    />

                    {allIncomeCategories.map((category) => (
                        <Bar
                            key={`${category}Realized`}
                            dataKey={`${category}Realized`}
                            stackId={category}
                            fill={getCategoryColor(category)}
                            name={category}
                            radius={[0, 0, 4, 4]}
                            barSize={20}
                        />
                    ))}
                    {allIncomeCategories.map((category) => (
                        <Bar
                            key={`${category}Remaining`}
                            dataKey={`${category}Remaining`}
                            stackId={category}
                            fill={`${getCategoryColor(category)}33`} // 20% opacity approximation
                            name={`${category} Goal`}
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    ))}

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
