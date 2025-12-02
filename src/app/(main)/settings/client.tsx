"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Trash2, Pencil, Repeat } from "lucide-react";
import { BudgetGoal, ExpenseBudget, Category, Tag } from "@/types";
import { addTag, deleteTag, deleteCategory } from "@/actions/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";

import { SmartCategoryDialog } from "@/components/categories/SmartCategoryDialog";

interface SettingsClientProps {
    budgetGoals: BudgetGoal[];
    expenseBudgets: ExpenseBudget[];
    categories: Category[];
    tags: Tag[];
}

export default function SettingsClient({
    budgetGoals,
    expenseBudgets,
    categories,
    tags
}: SettingsClientProps) {
    const [isAddIncomeGoalOpen, setIsAddIncomeGoalOpen] = useState(false);
    const [isAddExpenseLimitOpen, setIsAddExpenseLimitOpen] = useState(false);

    // Edit/Delete state
    const [categoryToEdit, setCategoryToEdit] = useState<(Category & { targetAmount?: number, color?: string }) | undefined>(undefined);
    const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Add Tag state
    const [isAddTagOpen, setIsAddTagOpen] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const handleAddTag = () => {
        setNewTagName("");
        setIsAddTagOpen(true);
    };

    const handleConfirmAddTag = async () => {
        if (newTagName) {
            await addTag(newTagName.startsWith('#') ? newTagName : `#${newTagName}`);
            setIsAddTagOpen(false);
        }
    };

    const handleDeleteTag = async (id: string) => {
        try {
            await deleteTag(id);
        } catch (error) {
            console.error("Failed to delete tag", error);
            alert("Failed to delete tag");
        }
    };

    const handleEditCategory = (category: Category, targetAmount?: number, color?: string) => {
        setCategoryToEdit({ ...category, targetAmount, color });
        setIsEditCategoryOpen(true);
    };

    const confirmDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id);
            setIsDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Failed to delete category", error);
            alert("Failed to delete category");
        }
    };

    // Helper to get goal/budget for a category
    const getGoal = (catName: string) => budgetGoals.find(g => g.category === catName);
    const getBudget = (catName: string) => expenseBudgets.find(b => b.category === catName);

    const incomeCategories = categories.filter(c => c.type === 'Income');
    const expenseCategories = categories.filter(c => c.type === 'Expense');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#1B2559]">Settings</h1>
                <Link href="/settings/recurring">
                    <Button className="bg-[#4318FF] hover:bg-[#3311DD] text-white rounded-xl px-6 py-6 font-bold">
                        <Repeat className="mr-2 h-5 w-5" />
                        Manage Recurring
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Income Goals */}
                <div className="bg-white rounded-[2rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[#1B2559] font-bold text-xl">Monthly Income Goals</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-[#F4F7FE] hover:bg-[#E0E5F2]"
                            onClick={() => setIsAddIncomeGoalOpen(true)}
                        >
                            <Plus className="h-4 w-4 text-[#1B2559]" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {incomeCategories.map((cat) => {
                            const goal = getGoal(cat.name);
                            return (
                                <div key={cat.id} className="space-y-2 group">
                                    <div className="flex justify-between items-center">
                                        <Label
                                            className="font-bold"
                                            style={{ color: goal?.color || '#1B2559' }}
                                        >
                                            {cat.name}
                                        </Label>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-[#A3AED0] hover:text-[#4318FF]"
                                                onClick={() => handleEditCategory(cat, goal?.targetAmount, goal?.color)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-[#A3AED0] hover:text-red-500"
                                                onClick={() => confirmDeleteCategory(cat)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            disabled
                                            defaultValue={goal ? `€ ${goal.targetAmount.toLocaleString()}` : "No Goal Set"}
                                            className="bg-[#F4F7FE] border-none rounded-xl py-6"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expense Budgets Limits */}
                <div className="bg-white rounded-[2rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[#1B2559] font-bold text-xl">Expense Budgets Limits</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-[#F4F7FE] hover:bg-[#E0E5F2]"
                            onClick={() => setIsAddExpenseLimitOpen(true)}
                        >
                            <Plus className="h-4 w-4 text-[#1B2559]" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {expenseCategories.map((cat) => {
                            const budget = getBudget(cat.name);
                            return (
                                <div key={cat.id} className="space-y-2 group">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[#A3AED0]">{cat.name}</Label>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-[#A3AED0] hover:text-[#4318FF]"
                                                onClick={() => handleEditCategory(cat, budget?.amount)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-[#A3AED0] hover:text-red-500"
                                                onClick={() => confirmDeleteCategory(cat)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Input
                                        disabled
                                        defaultValue={budget ? `€ ${budget.amount.toLocaleString()}` : "No Limit Set"}
                                        className="bg-[#F4F7FE] border-none rounded-xl py-6"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Transaction Properties */}
            <div className="bg-white rounded-[2rem] p-8">
                <h2 className="text-[#1B2559] font-bold text-xl mb-6">Transaction Properties</h2>

                {/* Tags */}
                <div className="border border-[#E0E5F2] rounded-3xl p-6 relative">
                    <h3 className="absolute -top-3 left-6 bg-white px-2 text-[#1B2559] font-bold text-lg">Tags</h3>
                    <div className="space-y-6 mt-2">
                        <div>
                            <p className="font-bold text-[#1B2559] mb-3">Custom Tags</p>
                            <div className="flex flex-wrap gap-3 items-center">
                                {tags.map(tag => (
                                    <div key={tag.id} className="flex items-center gap-1 border border-[#A3AED0] rounded-sm px-3 py-1 group hover:border-red-400 transition-colors">
                                        <span className="text-[#A3AED0] font-normal">{tag.name}</span>
                                        <button
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500 hover:text-red-700" />
                                        </button>
                                    </div>
                                ))}
                                <Button variant="ghost" className="text-[#4318FF] font-bold h-auto p-0 hover:bg-transparent" onClick={handleAddTag}>
                                    + Add Tag
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Dialogs */}
            <SmartCategoryDialog
                open={isAddIncomeGoalOpen}
                onOpenChange={setIsAddIncomeGoalOpen}
                defaultType="Income"
            />
            <SmartCategoryDialog
                open={isAddExpenseLimitOpen}
                onOpenChange={setIsAddExpenseLimitOpen}
                defaultType="Expense"
            />

            {/* Edit Dialog */}
            <SmartCategoryDialog
                open={isEditCategoryOpen}
                onOpenChange={setIsEditCategoryOpen}
                categoryToEdit={categoryToEdit}
                defaultType={categoryToEdit?.type}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the category &quot;{categoryToDelete?.name}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Tag Dialog */}
            <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription>
                            Enter the name for the new tag.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="tag-name" className="text-right">
                            Tag Name
                        </Label>
                        <Input
                            id="tag-name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="#Project"
                            className="col-span-3 mt-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirmAddTag();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmAddTag}>Add Tag</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
