"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { addBudgetGoal, getCategories } from "@/actions/data";
import { Category } from "@/types";

import { SmartCategoryDialog } from "@/components/categories/SmartCategoryDialog";

export function AddGoalDialog() {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        if (open) {
            getCategories('Income').then(setCategories);
        }
    }, [open]);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await addBudgetGoal(formData);
            setOpen(false);
        } catch (error) {
            console.error("Failed to add goal", error);
            alert("Failed to add goal");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "NEW_CATEGORY") {
            setIsAddingCategory(true);
            setSelectedCategory("");
        } else {
            setSelectedCategory(value);
        }
    };

    const handleCategoryCreated = (newCategory: Category) => {
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedCategory(newCategory.name);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-[#F4F7FE] hover:bg-[#E0E5F2]">
                    <Plus className="h-4 w-4 text-[#1B2559]" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Monthly Target</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">
                            Category
                        </label>
                        <SmartCategoryDialog
                            open={isAddingCategory}
                            onOpenChange={setIsAddingCategory}
                            defaultType="Income"
                            onSuccess={handleCategoryCreated}
                        />
                        <select
                            id="category"
                            name="category"
                            required
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                            <option value="NEW_CATEGORY" className="font-bold text-blue-600">
                                + Create new Category
                            </option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="targetAmount" className="text-sm font-medium">
                            Target Amount (€)
                        </label>
                        <input
                            id="targetAmount"
                            name="targetAmount"
                            type="number"
                            step="0.01"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="color" className="text-sm font-medium">
                            Color
                        </label>
                        <div className="flex gap-2">
                            {['#4318FF', '#05CD99', '#FFB547', '#E31A1A', '#333333'].map((color) => (
                                <label key={color} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        required
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-8 rounded-full bg-current border-2 border-transparent peer-checked:border-black peer-checked:scale-110 transition-all" style={{ color: color }} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Goal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
