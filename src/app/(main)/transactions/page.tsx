import { getTransactions, getBudgetGoals } from "@/actions/data";
import { TransactionsClient } from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function TransactionsPage() {
    const transactions = await getTransactions();
    const budgetGoals = await getBudgetGoals();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
                <Link href="/add-transaction">
                    <Button className="bg-[#4318FF] hover:bg-[#3311DD] text-white rounded-xl px-6 py-6 font-bold">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Transaction
                    </Button>
                </Link>
            </div>
            <TransactionsClient transactions={transactions} budgetGoals={budgetGoals} />
        </div>
    );
}
