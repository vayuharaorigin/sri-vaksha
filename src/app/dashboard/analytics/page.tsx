"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  BarChart4 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

// Mock Data
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, profit: 18000 },
  { month: "Feb", revenue: 52000, profit: 21000 },
  { month: "Mar", revenue: 49000, profit: 19500 },
  { month: "Apr", revenue: 63000, profit: 26000 },
  { month: "May", revenue: 58000, profit: 24000 },
  { month: "Jun", revenue: 71000, profit: 31000 },
];

const categorySales = [
  { name: "Interior Paint", value: 340, color: "#2563EB" },
  { name: "Exterior Paint", value: 210, color: "#10B981" },
  { name: "Wall Paint", value: 180, color: "#8B5CF6" },
  { name: "Primers", value: 95, color: "#F59E0B" },
];

const growthStats = [
  { title: "Monthly Revenue", value: "$71,000", change: "+22.4%", desc: "vs. previous month", icon: DollarSign, trend: "up" },
  { title: "New Customers", value: "348", change: "+14.2%", desc: "vs. previous month", icon: Users, trend: "up" },
  { title: "Average Order Value", value: "$184.50", change: "+3.8%", desc: "vs. previous month", icon: ShoppingBag, trend: "up" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep-dive business performance metrics and growth indicators.</p>
      </div>

      {/* Stripe-style Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {growthStats.map((stat, i) => (
          <Card key={i} className="overflow-hidden relative group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
              <div className="p-2.5 rounded-xl bg-secondary/80">
                <stat.icon size={16} className="text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Revenue and Profit Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle>Revenue & Profit Growth</CardTitle>
              <CardDescription>Track monthly gains and operational profit margins.</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                Revenue
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Profit
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #E5E7EB", borderRadius: "1rem" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Category Sales Breakdown */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Product sales breakdown by paint type.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ background: "rgba(255,255,255,0.9)", border: "1px solid #E5E7EB", borderRadius: "1rem" }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 pt-4 border-t">
              {categorySales.map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{entry.value} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
