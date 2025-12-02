"use client";

import React from "react";

import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExpenseTreasuryTableProps {
    selectedMonth: string;
}

export function ExpenseTreasuryTable({ selectedMonth }: ExpenseTreasuryTableProps) {
    const { transactions } = useData();

    const { expenseTransactions, toPay, paid, total } = React.useMemo(() => {
        const filtered = transactions.filter(t => {
            if (t.type !== 'Expense') return false;
            const date = new Date(t.date);
            const month = date.toLocaleString('en-US', { month: 'long' });
            return month === selectedMonth;
        });

        const toPayAmount = filtered
            .filter(t => t.status === 'À payer')
            .reduce((sum, t) => sum + t.amount, 0);

        const paidAmount = filtered
            .filter(t => t.status === 'Payé')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            expenseTransactions: filtered,
            toPay: toPayAmount,
            paid: paidAmount,
            total: toPayAmount + paidAmount
        };
    }, [transactions, selectedMonth]);

    return (
        <Card className="rounded-[20px] border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Trésorerie Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Statut</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead className="text-right">%</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Badge className="bg-[#FFF6E5] text-[#FFB547] hover:bg-[#FFF6E5] hover:bg-opacity-80 border-none rounded-full px-4 py-1 shadow-none">
                                    À payer
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-foreground">
                                {toPay.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {total > 0 ? ((toPay / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Badge className="bg-[#E6FBF5] text-[#05CD99] hover:bg-[#E6FBF5] hover:bg-opacity-80 border-none rounded-full px-4 py-1 shadow-none">
                                    Payé
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-foreground">
                                {paid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {total > 0 ? ((paid / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-t-2">
                            <TableCell className="font-bold text-foreground">Total</TableCell>
                            <TableCell className="text-right font-bold text-foreground">
                                {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
