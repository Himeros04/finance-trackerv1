export type TransactionType = 'Income' | 'Expense';
export type TransactionStatus = 'To bill' | 'Billed' | 'Pending' | 'Paid' | 'Received' | 'To pay';

export interface Transaction {
    id: string;
    user_id: string;
    date: string; // ISO date string YYYY-MM-DD
    entityName: string;
    category: string;
    tag?: string; // Optional
    status: TransactionStatus;
    amount: number;
    type: TransactionType;
}

export interface BudgetGoal {
    id?: string;
    user_id?: string;
    category: string;
    currentAmount: number;
    targetAmount: number;
    color: string; // Hex code
}

export interface MonthlyMetric {
    month: string;
    income: number;
    expense: number;
}

export interface RevenueData {
    month: string;
    [category: string]: number | string; // Dynamic keys for stacked bar chart
}

export interface ExpenseBudget {
    id?: string;
    user_id?: string;
    category: string;
    amount: number;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    type: 'Income' | 'Expense';
    targetAmount?: number;
}

export interface Tag {
    id: string;
    user_id: string;
    name: string;
}
