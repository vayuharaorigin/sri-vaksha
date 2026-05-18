"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Boxes, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Download,
  Paintbrush,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line
} from "recharts";
import Link from "next/link";
import { useInventory } from "@/context/InventoryContext";

// Mock Data
const salesData = [
  { name: "Mon", sales: 2400 },
  { name: "Tue", sales: 1398 },
  { name: "Wed", sales: 9800 },
  { name: "Thu", sales: 3908 },
  { name: "Fri", sales: 4800 },
  { name: "Sat", sales: 3800 },
  { name: "Sun", sales: 4300 },
];

const miniChartData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 25 }
];

const bestSellers = [
  { name: "Classic Navy Matte (5L)", category: "Wall Paint", sales: 142, revenue: "$7,810", percent: 85 },
  { name: "Ultra Gloss Clear Coat", sku: "U-COAT-G", sales: 98, revenue: "$4,410", percent: 65 },
  { name: "Warm Beige Silk (2.5L)", category: "Interior Paint", sales: 84, revenue: "$3,360", percent: 50 },
];

export default function DashboardPage() {
  const { products, logs, adjustStock } = useInventory();
  const [selectedDetail, setSelectedDetail] = useState<"products" | "stock" | "sales" | "revenue" | "low-stock" | null>(null);

  // 1. Total Stock calculation
  const totalStock = products.reduce((sum, p) => sum + p.qty, 0);

  // 2. Today's sales count (from logs)
  const checkoutsToday = logs.filter(l => l.change.startsWith("-"));
  const salesCount = checkoutsToday.length;

  // 3. Dynamic Revenue calculation
  const revenueToday = checkoutsToday.reduce((sum, log) => {
    const qtySold = Math.abs(parseInt(log.change)) || 0;
    const prod = products.find(p => p.name === log.item);
    const price = prod ? prod.price : 40.00;
    return sum + (qtySold * price);
  }, 0);
  const finalRevenue = revenueToday * 1.08;

  // 4. Low stock levels
  const lowStockItems = products.filter(p => p.qty <= 5);
  const lowStockCount = lowStockItems.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your paint shop's performance today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-card">
            <Download size={16} />
            Export Report
          </Button>
          <Link href="/dashboard/sell">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: 5 Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Products */}
        <Card 
          onClick={() => setSelectedDetail(selectedDetail === "products" ? null : "products")}
          className={`overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all ${
            selectedDetail === "products" ? "ring-2 ring-blue-500 shadow-md scale-[1.01]" : "hover:shadow-md"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Package size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{products.length}</span>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            {/* Sparkline */}
            <div className="h-10 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBlue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total Stock */}
        <Card 
          onClick={() => setSelectedDetail(selectedDetail === "stock" ? null : "stock")}
          className={`overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all ${
            selectedDetail === "stock" ? "ring-2 ring-emerald-500 shadow-md scale-[1.01]" : "hover:shadow-md"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Boxes size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalStock} L</span>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
            {/* Sparkline */}
            <div className="h-10 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Today Sales */}
        <Card 
          onClick={() => setSelectedDetail(selectedDetail === "sales" ? null : "sales")}
          className={`overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all ${
            selectedDetail === "sales" ? "ring-2 ring-indigo-500 shadow-md scale-[1.01]" : "hover:shadow-md"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500 opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today Sales</CardTitle>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <ShoppingCart size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{salesCount}</span>
              <span className="text-xs text-green-600 font-medium">Orders</span>
            </div>
            {/* Sparkline */}
            <div className="h-10 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorIndigo)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card 
          onClick={() => setSelectedDetail(selectedDetail === "revenue" ? null : "revenue")}
          className={`overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all ${
            selectedDetail === "revenue" ? "ring-2 ring-amber-500 shadow-md scale-[1.01]" : "hover:shadow-md"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <DollarSign size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${finalRevenue.toFixed(2)}</span>
              <span className="text-xs text-green-600 font-medium">Today</span>
            </div>
            {/* Sparkline */}
            <div className="h-10 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAmber)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card 
          onClick={() => setSelectedDetail(selectedDetail === "low-stock" ? null : "low-stock")}
          className={`overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all border-destructive/20 dark:border-destructive/30 ${
            selectedDetail === "low-stock" ? "ring-2 ring-red-500 shadow-md scale-[1.01]" : "hover:shadow-md"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-destructive opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <div className={`p-2 rounded-xl bg-red-50 text-destructive dark:bg-red-950/20 dark:text-destructive ${lowStockCount > 0 ? "animate-pulse" : ""}`}>
              <AlertTriangle size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${lowStockCount > 0 ? "text-destructive" : "text-green-600"}`}>
                {lowStockCount}
              </span>
              <span className="text-xs text-muted-foreground font-medium">Alerts</span>
            </div>
            {/* Dynamic warnings list */}
            <div className="text-[11px] text-muted-foreground mt-4 space-y-1">
              {lowStockItems.slice(0, 2).map((item) => (
                <div key={item.id} className="truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"/>
                  {item.name} ({item.qty} L left)
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <div className="truncate text-green-600 font-semibold flex items-center gap-1.5">
                  ✓ Stock levels healthy!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collapsible Category Detail Drawer */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border border-border/80 bg-white/60 dark:bg-card/40 backdrop-blur-xl rounded-3xl shadow-lg relative overflow-hidden">
              {/* Corner abstract decoration gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
              
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    {selectedDetail === "products" && <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    {selectedDetail === "stock" && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    {selectedDetail === "sales" && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                    {selectedDetail === "revenue" && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    {selectedDetail === "low-stock" && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
                    {selectedDetail === "products" && "Active Paint Catalog Breakdown"}
                    {selectedDetail === "stock" && "Paint Volume Inventory Levels"}
                    {selectedDetail === "sales" && "Today's Transaction Registry"}
                    {selectedDetail === "revenue" && "Dynamic Income Contribution"}
                    {selectedDetail === "low-stock" && "Critical Restock Assistant"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedDetail === "products" && "Analysis of SKU distributions and paint categories in active catalog."}
                    {selectedDetail === "stock" && "Granular volume in stock (Liters) per color swatch with health status."}
                    {selectedDetail === "sales" && "Logs of counter transactions completed by staff today."}
                    {selectedDetail === "revenue" && "Financial gross earnings split by color sales."}
                    {selectedDetail === "low-stock" && "Top up critical inventory levels in one tap."}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedDetail(null)} 
                  className="rounded-full w-8 h-8 p-0"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                
                {/* 1. TOTAL PRODUCTS BREAKDOWN */}
                {selectedDetail === "products" && (
                  <div className="space-y-6">
                    {/* Category Distribution Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Interior Paint", "Exterior Paint", "Wall Paint", "Primers"].map((cat) => {
                        const count = products.filter(p => p.category === cat).length;
                        const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                        return (
                          <div key={cat} className="p-4 bg-secondary/30 rounded-2xl border border-border/40">
                            <span className="text-xs text-muted-foreground font-medium block">{cat}</span>
                            <span className="text-2xl font-black mt-1 block">{count}</span>
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Quick Swatch List */}
                    <div className="border border-border/40 rounded-2xl overflow-hidden bg-background/50">
                      <div className="p-3 bg-secondary/50 font-semibold text-xs border-b border-border/40 grid grid-cols-3">
                        <span>Paint Name</span>
                        <span>SKU</span>
                        <span className="text-right">Category</span>
                      </div>
                      <div className="divide-y divide-border/30 max-h-48 overflow-y-auto">
                        {products.map(p => (
                          <div key={p.id} className="p-3 text-xs grid grid-cols-3 items-center">
                            <span className="flex items-center gap-2 font-bold">
                              <span className="w-3.5 h-3.5 rounded-md border border-black/10 flex-shrink-0" style={{ backgroundColor: p.rgb }} />
                              {p.name}
                            </span>
                            <span className="font-mono text-muted-foreground">{p.sku}</span>
                            <span className="text-right text-muted-foreground">{p.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TOTAL STOCK LEVEL BREAKDOWN */}
                {selectedDetail === "stock" && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Color Stock Levels (Highest to Lowest):</p>
                    <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                      {[...products].sort((a, b) => b.qty - a.qty).map(p => {
                        const isLow = p.qty <= 5;
                        const maxVal = 150; // max scale
                        const percent = Math.min(100, (p.qty / maxVal) * 100);
                        return (
                          <div key={p.id} className="space-y-1.5">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="flex items-center gap-2 font-bold">
                                <span className="w-3.5 h-3.5 rounded-md border border-black/10 flex-shrink-0" style={{ backgroundColor: p.rgb }} />
                                {p.name}
                              </span>
                              <span className="font-semibold flex items-center gap-2">
                                <span className={isLow ? "text-red-500 font-bold" : "text-emerald-500"}>
                                  {isLow ? "⚠️ Low Stock" : "✓ Healthy"}
                                </span>
                                <span className="text-muted-foreground">({p.qty} Liters)</span>
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500 shadow-inner"
                                style={{ 
                                  width: `${percent}%`,
                                  backgroundColor: p.rgb,
                                  filter: "brightness(0.95)"
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. TODAY SALES BREAKDOWN */}
                {selectedDetail === "sales" && (
                  <div className="space-y-4">
                    {checkoutsToday.length === 0 ? (
                      <div className="p-8 text-center bg-secondary/10 rounded-2xl border border-dashed flex flex-col items-center justify-center space-y-2">
                        <ShoppingCart size={24} className="text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">No counter sales logged yet today.</span>
                        <span className="text-[10px] text-muted-foreground/80">Process checkouts in the POS "Sell" screen to record real-time metrics.</span>
                      </div>
                    ) : (
                      <div className="border border-border/40 rounded-2xl overflow-hidden bg-background/50">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-secondary/50 font-semibold border-b border-border/40">
                              <th className="p-3">Invoice</th>
                              <th className="p-3">Paint Swatch</th>
                              <th className="p-3 text-right">Volume</th>
                              <th className="p-3 text-right">Authorized</th>
                              <th className="p-3 text-right">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {checkoutsToday.map((log) => {
                              const prod = products.find(p => p.name === log.item);
                              return (
                                <tr key={log.id} className="hover:bg-secondary/20">
                                  <td className="p-3 font-mono font-bold text-muted-foreground">#INV-{log.id}</td>
                                  <td className="p-3 flex items-center gap-2 font-bold">
                                    <span 
                                      className="w-3.5 h-3.5 rounded-md border border-black/10 flex-shrink-0" 
                                      style={{ backgroundColor: prod ? prod.rgb : "#ccc" }} 
                                    />
                                    {log.item}
                                  </td>
                                  <td className="p-3 text-right font-extrabold text-red-600">{log.change}</td>
                                  <td className="p-3 text-right text-muted-foreground">{log.user}</td>
                                  <td className="p-3 text-right text-muted-foreground">{log.time}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. REVENUE CONTRIBUTION BREAKDOWN */}
                {selectedDetail === "revenue" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1 p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl space-y-2">
                        <span className="text-xs text-muted-foreground font-semibold">Today's Revenue Total</span>
                        <div className="text-3xl font-black text-amber-600 dark:text-amber-400">${finalRevenue.toFixed(2)}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Subtotal: ${revenueToday.toFixed(2)} <br />
                          Sales Tax (8%): ${(revenueToday * 0.08).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground">Product Sales Contribution:</p>
                        <div className="space-y-2.5 max-h-48 overflow-y-auto">
                          {products.map(p => {
                            const paintLogs = checkoutsToday.filter(l => l.item === p.name);
                            const litersSold = paintLogs.reduce((sum, l) => sum + Math.abs(parseInt(l.change)), 0);
                            const paintRevenue = litersSold * p.price * 1.08;
                            if (paintRevenue === 0) return null;
                            const share = finalRevenue > 0 ? (paintRevenue / finalRevenue) * 100 : 0;
                            return (
                              <div key={p.id} className="space-y-1 text-xs">
                                <div className="flex justify-between font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.rgb }} />
                                    {p.name}
                                  </span>
                                  <span className="text-muted-foreground">${paintRevenue.toFixed(2)} ({share.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${share}%` }} />
                                </div>
                              </div>
                            );
                          }).filter(Boolean)}
                          {checkoutsToday.length === 0 && (
                            <div className="text-xs text-muted-foreground italic">No sales transactions available to calculate contribution share.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. LOW STOCK CRITICAL ALERTS & ONE-TAP RESTOCK */}
                {selectedDetail === "low-stock" && (
                  <div className="space-y-4">
                    {lowStockItems.length === 0 ? (
                      <div className="p-8 text-center bg-green-500/10 rounded-2xl border border-green-500/20 flex flex-col items-center justify-center space-y-1 text-green-600 dark:text-green-400">
                        <Check size={28} className="animate-bounce" />
                        <span className="text-sm font-bold">All inventory levels completely healthy!</span>
                        <span className="text-xs opacity-80">There are no critical low stock alerts to display.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground">Paints Under Threshold (&le; 5 Liters). Click Quick Restock to instantly add +10 L:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lowStockItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-red-500/15 flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <span className="flex items-center gap-2 font-bold text-xs">
                                  <span className="w-3.5 h-3.5 rounded-md border border-black/10 flex-shrink-0" style={{ backgroundColor: item.rgb }} />
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground mt-1 block">SKU: {item.sku} • Category: {item.category}</span>
                                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400 text-[10px] font-bold">
                                  ⚠️ {item.qty} L Left
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm text-xs px-3 h-9"
                                onClick={() => adjustStock(item.id, 10)}
                              >
                                Quick Restock (+10L)
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Analytics + Side Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Charts & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Area Chart: Sales Graph */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle>Sales Analysis</CardTitle>
                <CardDescription>Interactive view of sales performance over the past week.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-accent flex items-center gap-1">
                View detailed
                <ArrowUpRight size={14} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #E5E7EB", borderRadius: "1rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                      labelStyle={{ fontWeight: "bold", color: "#111" }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Grid of Two Small Analytics: Best Sellers & Weekly trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Sellers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Best Selling Colors</CardTitle>
                <CardDescription>Weekly top performers based on volume.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bestSellers.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">{item.sales} sold</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-accent h-full rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Restock suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Restock Recommendations</CardTitle>
                <CardDescription>Generated automatically based on run-rate.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-secondary/30 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Matte Crimson Accent</p>
                    <p className="text-[11px] text-muted-foreground">Order 20L to reach safety stock</p>
                  </div>
                  <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground rounded-lg">Order</Button>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">EcoPure Primer White</p>
                    <p className="text-[11px] text-muted-foreground">Order 50L to reach safety stock</p>
                  </div>
                  <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground rounded-lg">Order</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Col: Timeline + Activity Feed */}
        <div className="space-y-8">

          {/* Recent Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Billing & Sold Out Registry</CardTitle>
              <CardDescription>Recent transactions and inventory sell-outs.</CardDescription>
            </CardHeader>
            <CardContent className="relative pl-6 border-l border-border ml-3 space-y-6">
              {/* Show completely sold out products first, if any! */}
              {products.filter(p => p.qty === 0).map((prod) => (
                <div key={`soldout-${prod.id}`} className="relative">
                  <span className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ring-1 ring-border bg-red-600 animate-ping" />
                  <span className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ring-1 ring-border bg-red-600" />
                  <div>
                    <p className="text-xs font-extrabold text-red-600 flex items-center gap-1.5">
                      🛑 SOLD OUT ALERT
                    </p>
                    <p className="text-xs text-foreground font-semibold mt-0.5">{prod.name} is out of stock!</p>
                    <span className="text-[10px] text-muted-foreground block mt-1">Liters left: 0 L</span>
                  </div>
                </div>
              ))}

              {/* Show recent billing checkouts */}
              {logs.filter(l => l.change.startsWith("-") || l.qty === 0).slice(0, 4).map((activity) => {
                const isSoldOut = activity.qty === 0;
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ring-1 ring-border ${
                      isSoldOut ? "bg-red-600 animate-pulse" : "bg-blue-500"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isSoldOut ? "Stock Fully Sold Out" : "Customer Billing Completed"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.item} ({activity.change})
                      </p>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                          Invoice #{activity.id}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Rem: {activity.qty} L
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-1">{activity.time}</span>
                    </div>
                  </div>
                );
              })}

              {/* Catch-all when no billing transactions exist */}
              {logs.filter(l => l.change.startsWith("-") || l.qty === 0).length === 0 && products.filter(p => p.qty === 0).length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-6">
                  No billing checkout data or sold out items recorded today.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
