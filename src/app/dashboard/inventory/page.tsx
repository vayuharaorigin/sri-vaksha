"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";

export default function InventoryPage() {
  const { logs } = useInventory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1">Real-time stock logs and adjustments history.</p>
      </div>

      <Card className="rounded-3xl border border-border shadow-sm bg-card overflow-hidden">
        <CardHeader>
          <CardTitle>Stock Adjustment History</CardTitle>
          <CardDescription>Logs of manual and sales-driven inventory modifications.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paint Item</TableHead>
              <TableHead>Volume Change</TableHead>
              <TableHead>Final Volume</TableHead>
              <TableHead>Authorized By</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-semibold">{log.item}</TableCell>
                <TableCell className={`font-bold ${log.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {log.change}
                </TableCell>
                <TableCell>{log.qty} L</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="text-muted-foreground">{log.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
