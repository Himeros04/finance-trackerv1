"use client";

import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function TreasuryTable() {
    const { transactions } = useData();

    const incomeTransactions = transactions.filter(t => t.type === 'Income');

    const toBill = incomeTransactions
        .filter(t => t.status === 'À facturer')
        .reduce((sum, t) => sum + t.amount, 0);

    const billed = incomeTransactions
        .filter(t => t.status === 'Billed')
        .reduce((sum, t) => sum + t.amount, 0);

    const received = incomeTransactions
        .filter(t => t.status === 'Received')
        .reduce((sum, t) => sum + t.amount, 0);

    const total = toBill + billed + received;

    return (
        <Card className="rounded-[20px] border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1B2559]">Income Treasury</CardTitle>
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
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
                                    À facturer
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
                                {toBill.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-gray-500">
                                {total > 0 ? ((toBill / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                                    Pending Payment
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
                                {billed.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-gray-500">
                                {total > 0 ? ((billed / total) * 100).toFixed(1) : 0}%
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                                    Received
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-[#1B2559]">
                                {received.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right text-gray-500">
                                {total > 0 ? ((received / total) * 100).toFixed(1) : 0}%
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
