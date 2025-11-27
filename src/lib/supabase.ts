import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Database types
export type DbTransaction = {
    id: string;
    date: string;
    entity_name: string;
    category: string;
    tag: string;
    status: string;
    amount: number;
    type: 'Income' | 'Expense';
    created_at: string;
};

export type DbBudgetGoal = {
    id: string;
    category: string;
    current_amount: number;
    target_amount: number;
    color: string;
};

export type DbExpenseBudget = {
    id: string;
    category: string;
    amount: number;
};

export type DbCategory = {
    id: string;
    name: string;
};

export type DbTag = {
    id: string;
    name: string;
};
