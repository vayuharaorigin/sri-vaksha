"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Droplet,
  Menu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInventory } from "@/context/InventoryContext";
import { ChevronDown, MapPin } from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Sell", href: "/dashboard/sell", icon: ShoppingCart },
  { name: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const { activeBranch, setActiveBranch } = useInventory();
  
  const branches = [
    { id: "Hyderabad", name: "Hyderabad" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto print:hidden">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Droplet size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">PaintFlow</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link key={link.name} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active" 
                      className="absolute left-0 top-0 w-1 h-full bg-accent rounded-r-full"
                    />
                  )}
                  <Icon size={18} className={cn(
                    "transition-colors",
                    isActive ? "text-accent" : "group-hover:text-foreground"
                  )} />
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden print:overflow-visible">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu size={20} />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Droplet size={18} className="text-white" />
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 flex-1 max-w-2xl">
            {/* Branch Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg border border-border transition-colors text-sm font-semibold"
              >
                <MapPin size={14} className="text-accent" />
                {branches.find(b => b.id === activeBranch)?.name || "Select Branch"}
                <ChevronDown size={14} className="text-muted-foreground ml-1" />
              </button>
              
              {isBranchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBranchDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    {branches.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setActiveBranch(b.id);
                          setIsBranchDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors",
                          activeBranch === b.id ? "font-bold text-accent bg-accent/5" : "text-muted-foreground"
                        )}
                      >
                        {b.name} Branch
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search products, orders, customers..." 
                className="pl-10 h-10 bg-white/50 border-none shadow-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-accent w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-blue-600 p-0.5 shadow-sm cursor-pointer">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-xs font-bold text-primary">SA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#F5F7FA] dark:bg-[#09090b] print:bg-white print:overflow-visible">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 print:p-0">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Nav overlay - Simplified for now */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsMobileOpen(false)}>
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: 0 }}
             className="w-64 h-full bg-card p-4 border-r"
             onClick={e => e.stopPropagation()}
           >
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Droplet size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-lg">PaintFlow</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>✕</Button>
             </div>
             
             <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileOpen(false)}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium",
                      pathname === link.href ? "bg-accent/10 text-accent" : "text-muted-foreground"
                    )}>
                      <link.icon size={20} />
                      {link.name}
                    </div>
                  </Link>
                ))}
             </nav>
           </motion.div>
        </div>
      )}
    </div>
  );
}
