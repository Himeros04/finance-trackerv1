"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Transaction, Category, Tag } from "@/types";
import { updateTransaction, getCategories, getTags } from "@/actions/data";

interface EditTransactionDialogProps {
    transaction: Transaction;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ transaction, open, onOpenChange }: EditTransactionDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [formData, setFormData] = useState({
        date: transaction.date,
        entityName: transaction.entityName,
        category: transaction.category,
        tag: transaction.tag || "",
        status: transaction.status,
        amount: transaction.amount,
        type: transaction.type,
    });

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                const [cats, tgs] = await Promise.all([getCategories(), getTags()]);
                setCategories(cats);
                setTags(tgs);
            };
            fetchData();
            setFormData({
                date: transaction.date,
                entityName: transaction.entityName,
                category: transaction.category,
                tag: transaction.tag || "",
                status: transaction.status,
                amount: transaction.amount,
                type: transaction.type,
            });
        }
    }, [open, transaction]);

    const incomeStatuses = ['À facturer', 'Facturé', 'Reçu'];
    const expenseStatuses = ['À payer', 'Payé'];
    const statuses = formData.type === 'Income' ? incomeStatuses : expenseStatuses;
    const filteredCategories = categories.filter(c => c.type === formData.type);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateTransaction(transaction.id, {
                ...formData,
                tag: formData.tag || undefined // Handle optional tag
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Error updating transaction. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.type === 'Income' ? 'default' : 'outline'}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'Income', status: 'À facturer', category: '' }))}
                                className={formData.type === 'Income' ? 'bg-[#4318FF]' : ''}
                            >
                                Income
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === 'Expense' ? 'default' : 'outline'}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'Expense', status: 'À payer', category: '' }))}
                                className={formData.type === 'Expense' ? 'bg-[#FF5757]' : ''}
                            >
                                Expense
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="entityName">Entity Name</Label>
                        <Input
                            id="entityName"
                            value={formData.entityName}
                            onChange={(e) => setFormData(prev => ({ ...prev, entityName: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required
                        >
                            <option value="">Select category</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tag">Tag (Optional)</Label>
                        <select
                            id="tag"
                            value={formData.tag}
                            onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select tag</option>
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.name}>{tag.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={formData.status}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (€)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
