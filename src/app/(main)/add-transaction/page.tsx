"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, CheckCircle } from "lucide-react";
import { getCategories, getTags, addTransaction, addTag } from "@/actions/data";
import { Category, Tag } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { SmartCategoryDialog } from "@/components/categories/SmartCategoryDialog";
import { useData } from "@/context/DataContext";

export default function AddTransactionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialType = searchParams.get('type') === 'expense' ? 'Expense' : 'Income';
    const [type, setType] = useState<'Income' | 'Expense'>(initialType);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Data state
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);


    // New Item State
    const [newItemName, setNewItemName] = useState("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        entityName: '',
        category: '',
        tag: '',
        status: 'To bill',
        amount: ''
    });

    const incomeStatuses = ['To bill', 'Billed', 'Received'];
    const expenseStatuses = ['To pay', 'Paid'];
    const statuses = type === 'Income' ? incomeStatuses : expenseStatuses;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, tgs] = await Promise.all([getCategories(), getTags()]);
                setAllCategories(cats);
                setTags(tgs);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                // Loading finished
            }
        };
        fetchData();
    }, []);

    // Update status when type changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            status: type === 'Income' ? 'To bill' : 'To pay',
            category: '' // Reset category on type change as options change
        }));
    }, [type]);

    const filteredCategories = allCategories.filter(c => c.type === type);

    const { refreshData } = useData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('date', formData.date);
            data.append('entityName', formData.entityName);
            data.append('category', formData.category);
            data.append('tag', formData.tag);
            data.append('status', formData.status);
            data.append('amount', formData.amount);
            data.append('type', type);

            await addTransaction(data);
            await refreshData();

            // Show success message
            setShowSuccess(true);

            // Reset form but keep date and type
            setFormData(prev => ({
                ...prev,
                entityName: '',
                category: '',
                tag: '',
                amount: '',
                status: type === 'Income' ? 'To bill' : 'To pay'
            }));

            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Error adding transaction. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategoryCreated = (newCategory: Category) => {
        setAllCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        setFormData(prev => ({ ...prev, category: newCategory.name }));
    };

    const handleAddTag = async () => {
        if (!newItemName.trim()) return;
        try {
            const result = await addTag(newItemName);
            if (result.success && result.tag) {
                setTags(prev => [...prev, result.tag!].sort((a, b) => a.name.localeCompare(b.name)));
                setFormData(prev => ({ ...prev, tag: result.tag!.name }));
                setNewItemName("");
                setIsAddingTag(false);
            }
        } catch (error) {
            console.error("Failed to add tag", error);
            alert("Failed to add tag");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-[#1B2559]">Add Transaction</h1>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Transaction added successfully! You can add another one.</span>
                </div>
            )}

            {/* Transaction Type Toggle */}
            <div className="bg-white rounded-[2rem] p-2 inline-flex gap-2">
                <Button
                    onClick={() => setType('Income')}
                    className={`rounded-xl px-8 py-3 font-bold transition-all ${type === 'Income'
                        ? 'bg-[#4318FF] text-white shadow-lg'
                        : 'bg-transparent text-[#A3AED0] hover:bg-[#F4F7FE]'
                        }`}
                >
                    Income
                </Button>
                <Button
                    onClick={() => setType('Expense')}
                    className={`rounded-xl px-8 py-3 font-bold transition-all ${type === 'Expense'
                        ? 'bg-[#FF5757] text-white shadow-lg'
                        : 'bg-transparent text-[#A3AED0] hover:bg-[#F4F7FE]'
                        }`}
                >
                    Expense
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8">
                <div className="space-y-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-[#1B2559] font-bold">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="bg-[#F4F7FE] border-none rounded-xl py-6"
                            required
                        />
                    </div>

                    {/* Entity Name */}
                    <div className="space-y-2">
                        <Label htmlFor="entityName" className="text-[#1B2559] font-bold">
                            {type === 'Income' ? 'Nom Tx' : 'Nom dépense'}
                        </Label>
                        <Input
                            id="entityName"
                            type="text"
                            placeholder={type === 'Income' ? 'e.g., Acme Corp' : 'e.g., Adobe Creative'}
                            value={formData.entityName}
                            onChange={(e) => setFormData(prev => ({ ...prev, entityName: e.target.value }))}
                            className="bg-[#F4F7FE] border-none rounded-xl py-6"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="category" className="text-[#1B2559] font-bold">Category</Label>
                            <SmartCategoryDialog
                                open={isAddingCategory}
                                onOpenChange={setIsAddingCategory}
                                defaultType={type}
                                onSuccess={handleCategoryCreated}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-[#4318FF] hover:text-[#3311DD] p-0 h-auto font-medium"
                                onClick={() => setIsAddingCategory(true)}
                            >
                                <Plus className="h-4 w-4 mr-1" /> New Category
                            </Button>
                        </div>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-[#F4F7FE] border-none rounded-xl py-4 px-4 text-[#1B2559] font-medium"
                            required
                        >
                            <option value="">Select category</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tag */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="tag" className="text-[#1B2559] font-bold">Tag (Optional)</Label>
                            <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-[#4318FF] hover:text-[#3311DD] p-0 h-auto font-medium">
                                        <Plus className="h-4 w-4 mr-1" /> New Tag
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Tag</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Input
                                            placeholder="Tag Name"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddTag}>Add Tag</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <select
                            id="tag"
                            value={formData.tag}
                            onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                            className="w-full bg-[#F4F7FE] border-none rounded-xl py-4 px-4 text-[#1B2559] font-medium"
                        >
                            <option value="">Select tag</option>
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.name}>{tag.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-[#1B2559] font-bold">Status</Label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-[#F4F7FE] border-none rounded-xl py-4 px-4 text-[#1B2559] font-medium"
                            required
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-[#1B2559] font-bold">Amount (€)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            className="bg-[#F4F7FE] border-none rounded-xl py-6 text-2xl font-bold"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 rounded-xl py-6 border-2 border-[#E0E5F2] text-[#A3AED0] font-bold hover:bg-[#F4F7FE]"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`flex-1 rounded-xl py-6 font-bold text-white ${type === 'Income'
                                ? 'bg-[#4318FF] hover:bg-[#3311DD]'
                                : 'bg-[#FF5757] hover:bg-[#EE4444]'
                                }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : `Add ${type}`}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
