"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInventory } from "@/context/InventoryContext";
import { MapPin, Package, Box, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const branches = [
  { 
    id: "Hyderabad", 
    name: "Hyderabad Branch", 
    location: "Banjara Hills, Hyderabad", 
    products: 412, 
    stock: 4500, 
    sales: "₹45,200", 
    status: "Active" 
  },
  { 
    id: "Vijayawada", 
    name: "Vijayawada Branch", 
    location: "MG Road, Vijayawada", 
    products: 380, 
    stock: 3200, 
    sales: "₹28,500", 
    status: "Active" 
  },
  { 
    id: "Guntur", 
    name: "Guntur Branch", 
    location: "Arundelpet, Guntur", 
    products: 290, 
    stock: 2100, 
    sales: "₹18,900", 
    status: "Active" 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BranchesPage() {
  const router = useRouter();
  const { setActiveBranch } = useInventory();

  const handleSelectBranch = (branchId: string) => {
    setActiveBranch(branchId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Select Workspace</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a branch to view isolated inventory, sales, and analytics data.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {branches.map((branch) => (
            <motion.div key={branch.id} variants={itemVariants}>
              <Card 
                onClick={() => handleSelectBranch(branch.id)}
                className="group cursor-pointer overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:bg-card hover:shadow-xl hover:border-accent/30 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{branch.name}</h2>
                      <div className="flex items-center text-muted-foreground mt-1.5 text-sm">
                        <MapPin size={14} className="mr-1.5" />
                        {branch.location}
                      </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle size={12} />
                      {branch.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Package size={14} /> Total Items
                      </div>
                      <div className="text-lg font-bold text-foreground">{branch.products}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Box size={14} /> Current Stock
                      </div>
                      <div className="text-lg font-bold text-foreground">{branch.stock}</div>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp size={14} /> Today's Sales
                      </div>
                      <div className="text-xl font-bold text-accent">{branch.sales}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm font-semibold text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Enter Workspace <ArrowRight size={16} className="ml-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
