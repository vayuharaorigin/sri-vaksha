"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  Boxes, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Download,
  Paintbrush
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
  const { products, logs } = useInventory();

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
        <Card className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <Card className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <Card className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <Card className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <Card className="overflow-hidden relative group border-destructive/20 dark:border-destructive/30">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-destructive opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <div className="p-2 rounded-xl bg-red-50 text-destructive dark:bg-red-950/20 dark:text-destructive animate-pulse">
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
          
          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/95 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Paintbrush className="text-accent" size={18} />
                PaintFlow POS
              </CardTitle>
              <CardDescription className="text-white/60">Fast counter checkout & inventory adjustments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/sell" className="block w-full">
                <Button className="w-full bg-white text-primary hover:bg-white/90 gap-2 h-11">
                  Launch Quick Sell Flow
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard/products" className="block w-full">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white gap-2 h-11 bg-transparent">
                  Browse Inventory
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
              <CardDescription>Real-time updates of operations.</CardDescription>
            </CardHeader>
            <CardContent className="relative pl-6 border-l border-border ml-3 space-y-6">
              {logs.slice(0, 4).map((activity) => {
                const isAdded = activity.change.startsWith("+");
                const isDeducted = activity.change.startsWith("-");
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ring-1 ring-border ${
                      isAdded ? "bg-emerald-500" :
                      isDeducted ? "bg-blue-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isAdded ? "Stock Restocked" : isDeducted ? "Order Completed" : "Catalog Adjusted"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.item} ({activity.change})</p>
                      <span className="text-[10px] text-muted-foreground block mt-1">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
