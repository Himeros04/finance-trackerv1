"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Pause, Play, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { RecurringTransaction } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function RecurringSettingsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('recurring_transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setTransactions(data as any);
        } catch (error) {
            console.error("Error fetching recurring transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('recurring_transactions')
                .update({ active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchTransactions();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteTransaction = async (id: string) => {
        if (!confirm("Are you sure you want to delete this recurring transaction?")) return;

        try {
            const { error } = await supabase
                .from('recurring_transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTransactions();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-[#1B2559] dark:text-white">Recurring Transactions</h1>
            </div>

            <div className="bg-white dark:bg-[#111C44] rounded-[2rem] p-6 shadow-sm">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No recurring transactions found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-[#F4F7FE] dark:bg-[#1B254B] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${tx.type === 'Income' ? 'bg-[#05CD99]' : 'bg-[#E60000]'}`} />
                                    <div>
                                        <h3 className="font-bold text-[#1B2559] dark:text-white">{tx.entity_name}</h3>
                                        <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span>{tx.category}</span>
                                            <span>•</span>
                                            <span>{tx.frequency}</span>
                                            <span>•</span>
                                            <span>Next: {tx.next_run_date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <p className={`font-bold ${tx.type === 'Income' ? 'text-[#05CD99]' : 'text-[#E60000]'}`}>
                                            {tx.type === 'Income' ? '+' : '-'}{Number(tx.amount).toFixed(2)}€
                                        </p>
                                        <Badge variant={tx.active ? "default" : "secondary"}>
                                            {tx.active ? "Active" : "Paused"}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleActive(tx.id, tx.active)}
                                            className={tx.active ? "text-yellow-500 hover:text-yellow-600" : "text-green-500 hover:text-green-600"}
                                        >
                                            {tx.active ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTransaction(tx.id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
