"use client";

import { useEffect, useState } from "react";
import { getDueRecurringTransactions, processRecurringTransaction } from "@/actions/data";
import { RecurringTransaction } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";

export function RecurringTransactionChecker() {
    const [dueTransactions, setDueTransactions] = useState<RecurringTransaction[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { refreshData } = useData();

    useEffect(() => {
        const checkDueTransactions = async () => {
            try {
                const transactions = await getDueRecurringTransactions();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (transactions && transactions.length > 0) {
                    setDueTransactions(transactions as any);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Failed to check recurring transactions", error);
            }
        };

        checkDueTransactions();
    }, []);

    const handleGenerate = async () => {
        setIsProcessing(true);
        try {
            await Promise.all(dueTransactions.map(tx => processRecurringTransaction(tx.id)));
            await refreshData();
            setIsOpen(false);
            setDueTransactions([]);
        } catch (error) {
            console.error("Failed to process transactions", error);
            alert("Failed to process some transactions.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (dueTransactions.length === 0) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recurring Transactions Due</DialogTitle>
                    <DialogDescription>
                        The following recurring transactions are due for generation:
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    {dueTransactions.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">{tx.entity_name}</p>
                                <p className="text-sm text-muted-foreground">{tx.category}</p>
                            </div>
                            <div className="font-bold">
                                {tx.type === 'Expense' ? '-' : '+'}{Number(tx.amount).toFixed(2)}€
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Skip
                    </Button>
                    <Button onClick={handleGenerate} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate All
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
