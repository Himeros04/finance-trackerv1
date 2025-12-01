"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, BudgetGoal, RevenueData, MonthlyMetric, ExpenseBudget } from '@/types';
import { supabase } from '@/lib/supabase';

interface DataContextType {
    transactions: Transaction[];
    budgetGoals: BudgetGoal[];
    revenueData: RevenueData[];
    cashflowMetrics: MonthlyMetric[];
    expenseBudgets: ExpenseBudget[];
    categories: string[];
    tags: string[];
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [cashflowMetrics, setCashflowMetrics] = useState<MonthlyMetric[]>([]);
    const [expenseBudgets, setExpenseBudgets] = useState<ExpenseBudget[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);



    // Fetch all data from Supabase
    const refreshData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Fetch transactions
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (txError) throw txError;

            // Transform database format to app format
            const formattedTransactions: Transaction[] = txData?.map(tx => ({
                id: tx.id,
                user_id: tx.user_id,
                date: tx.date,
                entityName: tx.entity_name,
                category: tx.category,
                tag: tx.tag,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                status: tx.status as any,
                amount: Number(tx.amount),
                type: tx.type as 'Income' | 'Expense'
            })) || [];

            setTransactions(formattedTransactions);

            // Fetch budget goals
            const { data: bgData, error: bgError } = await supabase
                .from('budget_goals')
                .select('*');

            if (bgError) throw bgError;

            const formattedBudgetGoals: BudgetGoal[] = bgData?.map(bg => ({
                id: bg.id,
                user_id: bg.user_id,
                category: bg.category,
                currentAmount: Number(bg.current_amount),
                targetAmount: Number(bg.target_amount),
                color: bg.color
            })) || [];

            setBudgetGoals(formattedBudgetGoals);

            // Fetch expense budgets
            const { data: ebData, error: ebError } = await supabase
                .from('expense_budgets')
                .select('*');

            if (ebError) throw ebError;

            const formattedExpenseBudgets: ExpenseBudget[] = ebData?.map(eb => ({
                id: eb.id,
                user_id: eb.user_id,
                category: eb.category,
                amount: Number(eb.amount)
            })) || [];

            setExpenseBudgets(formattedExpenseBudgets);

            // Fetch categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('name');

            if (catError) throw catError;
            setCategories(catData?.map(c => c.name) || []);

            // Fetch tags
            const { data: tagData, error: tagError } = await supabase
                .from('tags')
                .select('name');

            if (tagError) throw tagError;
            setTags(tagData?.map(t => t.name) || []);

            // Calculate derived data (revenue data, cashflow metrics)
            // Defined inside to access state setters and be part of the callback
            const calculateDerivedData = (txs: Transaction[], goals: BudgetGoal[]) => {
                // Calculate monthly revenue by category
                const monthlyRevenue: { [month: string]: { [category: string]: number } } = {};

                txs.forEach(tx => {
                    if (tx.type === 'Income') {
                        // Parse date manually to avoid timezone issues (YYYY-MM-DD)
                        const [year, monthIndex, day] = tx.date.split('-').map(Number);
                        const date = new Date(year, monthIndex - 1, day);

                        const month = date.toLocaleString('en-US', { month: 'short' });

                        if (!monthlyRevenue[month]) {
                            monthlyRevenue[month] = {};
                        }

                        if (!monthlyRevenue[month][tx.category]) {
                            monthlyRevenue[month][tx.category] = 0;
                        }

                        monthlyRevenue[month][tx.category] += tx.amount;
                    }
                });

                // Convert to RevenueData format
                const revenueArray: RevenueData[] = Object.keys(monthlyRevenue).map(month => ({
                    month,
                    ...monthlyRevenue[month]
                }));

                setRevenueData(revenueArray);

                // Calculate cashflow metrics dynamically
                const monthlyMetricsMap: { [month: string]: MonthlyMetric } = {};

                txs.forEach(tx => {
                    // Parse date manually to avoid timezone issues (YYYY-MM-DD)
                    const [year, monthIndex, day] = tx.date.split('-').map(Number);
                    const date = new Date(year, monthIndex - 1, day);

                    const monthName = date.toLocaleString('en-US', { month: 'long' });

                    if (!monthlyMetricsMap[monthName]) {
                        monthlyMetricsMap[monthName] = { month: monthName, income: 0, expense: 0 };
                    }

                    if (tx.type === 'Income') {
                        monthlyMetricsMap[monthName].income += tx.amount;
                    } else if (tx.type === 'Expense') {
                        monthlyMetricsMap[monthName].expense += tx.amount;
                    }
                });

                // Convert to array and sort by date
                const monthsOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                const monthlyMetrics = Object.values(monthlyMetricsMap).sort((a, b) => {
                    return monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month); // Descending order
                });

                setCashflowMetrics(monthlyMetrics);

                // Update budget goals current amounts
                const updatedGoals = goals.map(goal => {
                    const amount = txs
                        .filter(t => t.category === goal.category && t.type === 'Income')
                        .reduce((sum, t) => sum + t.amount, 0);
                    return { ...goal, currentAmount: amount };
                });

                setBudgetGoals(updatedGoals);
            };

            // Calculate revenue data and cashflow metrics from transactions
            calculateDerivedData(formattedTransactions, formattedBudgetGoals);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const value = React.useMemo(() => ({
        transactions,
        budgetGoals,
        revenueData,
        cashflowMetrics,
        categories,
        tags,
        expenseBudgets,
        loading,
        refreshData
    }), [
        transactions,
        budgetGoals,
        revenueData,
        cashflowMetrics,
        categories,
        tags,
        expenseBudgets,
        loading,
        refreshData
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
