import { getTransactions, getBudgetGoals } from "@/actions/data";
import { TransactionsClient } from "./client";

export default async function TransactionsPage() {
    const transactions = await getTransactions();
    const budgetGoals = await getBudgetGoals();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1B2559]">All Transactions</h1>
            <TransactionsClient transactions={transactions} budgetGoals={budgetGoals} />
        </div>
    );
}
