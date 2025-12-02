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
        .filter(t => t.status === 'Facturé')
        .reduce((sum, t) => sum + t.amount, 0);

    const received = incomeTransactions
        .filter(t => t.status === 'Reçu')
        .reduce((sum, t) => sum + t.amount, 0);

    const total = toBill + billed + received;

    return (
        <Card className="rounded-[20px] border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1B2559]">Trésorerie Revenus</CardTitle>
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
                                <Badge className="bg-[#EBE6FF] text-[#4318FF] hover:bg-[#EBE6FF] hover:bg-opacity-80 border-none rounded-full px-4 py-1 shadow-none">
                                    Facturé
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
                                <Badge className="bg-[#E6FBF5] text-[#05CD99] hover:bg-[#E6FBF5] hover:bg-opacity-80 border-none rounded-full px-4 py-1 shadow-none">
                                    Reçu
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
