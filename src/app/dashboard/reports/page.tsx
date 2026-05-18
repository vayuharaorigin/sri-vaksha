"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { name: "Monthly Sales Tax Ledger", date: "May 2026", size: "1.2 MB", type: "PDF" },
    { name: "Q1 Stock Turnover Valuation", date: "Apr 2026", size: "4.8 MB", type: "XLSX" },
    { name: "Supplier Run-Rate Restock Audit", date: "Mar 2026", size: "850 KB", type: "PDF" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Export structured financial and inventory data ledgers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                  {report.type}
                </span>
                <CardTitle className="text-base font-semibold pt-2">{report.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Calendar size={12} />
                  {report.date}
                </CardDescription>
              </div>
              <div className="p-3 bg-secondary/80 rounded-2xl">
                <FileText size={20} className="text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{report.size}</span>
                <Button size="sm" variant="outline" className="gap-1.5 h-9 rounded-xl">
                  <Download size={14} />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
