"use client";

import { useState } from "react";
import { DataTable } from "@/components/transactions/data-table";
import { getColumns } from "@/components/transactions/columns";
import { Transaction, BudgetGoal } from "@/types";
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog";

interface TransactionsClientProps {
    transactions: Transaction[];
    budgetGoals: BudgetGoal[];
}

export function TransactionsClient({ transactions, budgetGoals }: TransactionsClientProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    // Create a map of category colors
    const categoryColors = budgetGoals.reduce((acc, goal) => {
        acc[goal.category] = goal.color;
        return acc;
    }, {} as Record<string, string>);

    const columns = getColumns(handleEdit, categoryColors);

    return (
        <>
            <DataTable columns={columns} data={transactions} />
            {selectedTransaction && (
                <EditTransactionDialog
                    transaction={selectedTransaction}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </>
    );
}
