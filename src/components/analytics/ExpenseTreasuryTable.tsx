"use client";

import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExpenseTreasuryTableProps {
    selectedMonth: string;
}

export function ExpenseTreasuryTable({ selectedMonth }: ExpenseTreasuryTableProps) {
    const { transactions } = useData();

    const expenseTransactions = transactions.filter(t => {
        if (t.type !== 'Expense') return false;
        const date = new Date(t.date);
        const month = date.toLocaleString('en-US', { month: 'long' });
        return month === selectedMonth;
    });

    const toPay = expenseTransactions
        .filter(t => t.status === 'To pay')
        .reduce((sum, t) => sum + t.amount, 0);

    const paid = expenseTransactions
        .filter(t => t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0);

    const total = toPay + paid;

    return (
        <Card className="rounded-[20px] border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1B2559]">Expense Treasury</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">%</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
                                    To Pay
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
                                {toPay.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-gray-500">
                                {total > 0 ? ((toPay / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                                    Paid
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
                                {paid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-gray-500">
                                {total > 0 ? ((paid / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-t-2">
                            <TableCell className="font-bold text-[#1B2559]">Total</TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
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
