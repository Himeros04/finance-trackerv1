"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteTransaction } from "@/actions/data";

export const getColumns = (onEdit: (transaction: Transaction) => void, categoryColors: Record<string, string>): ColumnDef<Transaction>[] => {
    const handleDelete = async (id: string) => {
        try {
            await deleteTransaction(id);
        } catch (error) {
            console.error("Failed to delete transaction", error);
            alert("Failed to delete transaction");
        }
    };

    return [
        {
            accessorKey: "date",
            header: "DATE",
            cell: ({ row }) => {
                const date = new Date(row.getValue("date"));
                const formatted = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                return <div className="font-medium text-[#1B2559]">{formatted}</div>;
            },
        },
        {
            accessorKey: "entityName",
            header: "ENTITY / NAME",
            cell: ({ row }) => <div className="font-bold text-[#1B2559]">{row.getValue("entityName")}</div>,
        },
        {
            accessorKey: "category",
            header: "CATEGORY",
            cell: ({ row }) => {
                const category = row.getValue("category") as string;
                const color = categoryColors[category];

                let style = {};
                let className = "rounded-md px-3 py-1 shadow-none hover:bg-opacity-80";

                if (color) {
                    style = {
                        backgroundColor: `${color}20`, // 20 hex = ~12% opacity
                        color: color
                    };
                } else {
                    // Fallback to existing logic or default
                    let bg = "bg-gray-100";
                    let text = "text-gray-800";

                    if (category.includes("Hoptisens")) { bg = "bg-[#EBE6FF]"; text = "text-[#4318FF]"; }
                    else if (category.includes("Hoptilearn")) { bg = "bg-[#E6FBF5]"; text = "text-[#05CD99]"; }
                    else if (category.includes("Guitar")) { bg = "bg-[#FFF6E5]"; text = "text-[#FFB547]"; }
                    else if (category.includes("Abo")) { bg = "bg-[#FFF6E5]"; text = "text-[#FFB547]"; }

                    className += ` ${bg} ${text}`;
                }

                return (
                    <Badge className={className} style={style}>
                        {category.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "tag",
            header: "TAGS",
            cell: ({ row }) => <div className="text-[#A3AED0]">{row.getValue("tag")}</div>,
        },
        {
            accessorKey: "status",
            header: "STATUS",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let bg = "bg-gray-100";
                let text = "text-gray-800";

                if (status === "Received" || status === "Reçu") { bg = "bg-[#E6FBF5]"; text = "text-[#05CD99]"; }
                else if (status === "Paid" || status === "Payé") { bg = "bg-[#F4F7FE]"; text = "text-[#A3AED0]"; }
                else if (status === "To bill" || status === "À facturer") { bg = "bg-[#FFF6E5]"; text = "text-[#FFB547]"; }
                else if (status === "Pending") { bg = "bg-[#FFF6E5]"; text = "text-[#FFB547]"; }

                return (
                    <Badge className={cn("rounded-full px-4 py-1 shadow-none hover:bg-opacity-80", bg, text)}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "amount",
            header: "AMOUNT",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const type = row.original.type;
                const isIncome = type === "Income";

                return (
                    <div className={cn("font-bold", isIncome ? "text-[#05CD99]" : "text-[#1B2559]")}>
                        {isIncome ? "+ " : "- "}€ {amount.toLocaleString()}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3AED0] hover:text-[#4318FF]"
                            onClick={() => onEdit(row.original)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3AED0] hover:text-red-500"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
};
