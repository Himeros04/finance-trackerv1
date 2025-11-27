
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Target, AlertCircle } from "lucide-react"
import { addCategory } from "@/actions/data"
import { Category } from "@/types"
import { z } from "zod"

import { updateCategory } from "@/actions/data"

interface SmartCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultType?: 'Income' | 'Expense'
    categoryToEdit?: Category & { targetAmount?: number, color?: string }
    onSuccess?: (category: Category) => void
}

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["Income", "Expense"]),
    targetAmount: z.number().min(0, "Amount must be positive").optional(),
})

export function SmartCategoryDialog({
    open,
    onOpenChange,
    defaultType = 'Income',
    categoryToEdit,
    onSuccess
}: SmartCategoryDialogProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<'Income' | 'Expense'>(defaultType)
    const [targetAmount, setTargetAmount] = useState("")
    const [selectedColor, setSelectedColor] = useState("#4318FF")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const colors = ['#4318FF', '#05CD99', '#FFB547', '#E31A1A', '#333333']

    useEffect(() => {
        if (open) {
            if (categoryToEdit) {
                setName(categoryToEdit.name)
                setType(categoryToEdit.type)
                setTargetAmount(categoryToEdit.targetAmount?.toString() || "")
                setSelectedColor(categoryToEdit.color || "#4318FF")
            } else {
                setType(defaultType)
                setName("")
                setTargetAmount("")
                setSelectedColor("#4318FF")
            }
            setError("")
        }
    }, [open, defaultType, categoryToEdit])

    const handleSubmit = async () => {
        setError("")
        setIsSubmitting(true)

        try {
            const amount = targetAmount ? parseFloat(targetAmount) : undefined

            const validationResult = categorySchema.safeParse({
                name,
                type,
                targetAmount: amount
            })

            if (!validationResult.success) {
                setError(validationResult.error.issues[0].message)
                setIsSubmitting(false)
                return
            }

            let result;
            if (categoryToEdit) {
                result = await updateCategory(categoryToEdit.id, name, type, amount, type === 'Income' ? selectedColor : undefined)
            } else {
                result = await addCategory(name, type, amount, type === 'Income' ? selectedColor : undefined)
            }

            if (result.success) {
                onSuccess?.(result.category || categoryToEdit!)
                onOpenChange(false)
            }
        } catch (err) {
            console.error(err)
            setError(categoryToEdit ? "Failed to update category" : "Failed to create category")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{categoryToEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Type Toggle */}
                    <div className="bg-[#F4F7FE] rounded-xl p-1 inline-flex gap-1 w-fit">
                        <Button
                            type="button"
                            onClick={() => setType('Income')}
                            className={`rounded-lg px-6 py-2 font-bold transition-all ${type === 'Income'
                                ? 'bg-[#4318FF] text-white shadow-md'
                                : 'bg-transparent text-[#A3AED0] hover:bg-white'
                                }`}
                        >
                            Income
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setType('Expense')}
                            className={`rounded-lg px-6 py-2 font-bold transition-all ${type === 'Expense'
                                ? 'bg-[#FF5757] text-white shadow-md'
                                : 'bg-transparent text-[#A3AED0] hover:bg-white'
                                }`}
                        >
                            Expense
                        </Button>
                    </div>

                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Groceries, Salary"
                            className="bg-[#F4F7FE] border-none rounded-xl"
                        />
                    </div>

                    {/* Target Amount / Budget Limit */}
                    <div className="grid gap-2">
                        <Label htmlFor="targetAmount" className="flex items-center gap-2">
                            {type === 'Expense' ? (
                                <>
                                    <Shield className="h-4 w-4 text-red-500" />
                                    Budget Limit (Monthly)
                                </>
                            ) : (
                                <>
                                    <Target className="h-4 w-4 text-blue-500" />
                                    Goal Target (Monthly)
                                </>
                            )}
                        </Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="Optional amount"
                            className="bg-[#F4F7FE] border-none rounded-xl"
                        />
                        <p className="text-xs text-muted-foreground">
                            {type === 'Expense'
                                ? "Set a maximum spending limit for this category."
                                : "Set a monthly revenue target for this source."}
                        </p>
                    </div>

                    {/* Color Picker (only for Income) */}
                    {type === 'Income' && (
                        <div className="grid gap-2">
                            <Label>Color</Label>
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full transition-all ${selectedColor === color
                                            ? 'ring-2 ring-offset-2 ring-black scale-110'
                                            : 'hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (categoryToEdit ? "Updating..." : "Creating...") : (categoryToEdit ? "Update Category" : "Create Category")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
