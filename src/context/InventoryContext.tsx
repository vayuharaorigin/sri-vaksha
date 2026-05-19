"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  qty: number;
  price: number;
  status: string;
  rgb: string;
}

export interface StockLog {
  id: number;
  item: string;
  change: string;
  qty: number; // final quantity
  user: string;
  time: string;
}

interface InventoryContextType {
  products: Product[];
  logs: StockLog[];
  isLoaded: boolean;
  activeBranch: string;
  setActiveBranch: (branch: string) => void;
  addProduct: (product: Omit<Product, "id" | "status">) => void;
  updateProduct: (id: number, updates: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: number) => void;
  processCheckout: (cartItems: { product: Product; quantity: number }[]) => void;
  adjustStock: (id: number, amount: number) => void;
}

const initialProducts: Product[] = [
  { id: 1, name: "Royal Satin Blue", category: "Interior Paint", sku: "PF-RSB-01", qty: 24, price: 45.00, status: "In Stock", rgb: "#1E3A8A" },
  { id: 2, name: "Matte Crimson Accent", category: "Interior Paint", sku: "PF-MCA-02", qty: 3, price: 52.00, status: "Low Stock", rgb: "#EF4444" },
  { id: 3, name: "Classic Navy Matte", category: "Wall Paint", sku: "PF-CNM-03", qty: 142, price: 38.00, status: "In Stock", rgb: "#1e293b" },
  { id: 4, name: "EcoPure Primer White", category: "Primers", sku: "PF-EPW-04", qty: 5, price: 29.99, status: "Low Stock", rgb: "#f8fafc" },
  { id: 5, name: "Warm Beige Silk", category: "Interior Paint", sku: "PF-WBS-05", qty: 84, price: 40.00, status: "In Stock", rgb: "#d97706" },
  { id: 6, name: "Forest Canopy Satin", category: "Exterior Paint", sku: "PF-FCS-06", qty: 18, price: 48.00, status: "In Stock", rgb: "#065f46" },
];

const initialLogs: StockLog[] = [
  { id: 1, item: "Royal Satin Blue", change: "+10 L", qty: 24, user: "John Doe", time: "10 mins ago" },
  { id: 2, item: "Matte Crimson Accent", change: "-5 L", qty: 3, user: "Jane Smith", time: "2 hours ago" },
  { id: 3, item: "EcoPure Primer White", change: "-10 L", qty: 5, user: "John Doe", time: "Yesterday" },
];

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [activeBranch, setActiveBranchState] = useState<string>("Hyderabad");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [logs, setLogs] = useState<StockLog[]>(initialLogs);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount or branch change
  useEffect(() => {
    setIsLoaded(false);
    // Initialize or load branch specific data
    const storedProducts = localStorage.getItem(`pf_products_${activeBranch}`);
    const storedLogs = localStorage.getItem(`pf_logs_${activeBranch}`);

    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        console.error("Failed to parse products from localstorage", e);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem(`pf_products_${activeBranch}`, JSON.stringify(initialProducts));
    }

    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error("Failed to parse logs from localstorage", e);
      }
    } else {
      setLogs(initialLogs);
      localStorage.setItem(`pf_logs_${activeBranch}`, JSON.stringify(initialLogs));
    }

    setIsLoaded(true);
  }, [activeBranch]);

  const setActiveBranch = (branch: string) => {
    setActiveBranchState(branch);
    localStorage.setItem("pf_active_branch", branch);
  };

  // Restore last active branch on initial load
  useEffect(() => {
    const savedBranch = localStorage.getItem("pf_active_branch");
    if (savedBranch) {
      setActiveBranchState(savedBranch);
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem(`pf_products_${activeBranch}`, JSON.stringify(updatedProducts));
  };

  const saveLogs = (updatedLogs: StockLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem(`pf_logs_${activeBranch}`, JSON.stringify(updatedLogs));
  };

  const addProduct = (p: Omit<Product, "id" | "status">) => {
    const newProduct: Product = {
      ...p,
      id: products.length > 0 ? Math.max(...products.map(prod => prod.id)) + 1 : 1,
      status: p.qty <= 5 ? "Low Stock" : "In Stock"
    };

    const updatedProducts = [newProduct, ...products];
    saveProducts(updatedProducts);

    const newLog: StockLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      item: p.name,
      change: `+${p.qty} L`,
      qty: p.qty,
      user: "John Doe",
      time: "Just now"
    };
    saveLogs([newLog, ...logs]);
  };

  const deleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;

    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);

    const newLog: StockLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      item: productToDelete.name,
      change: `Removed`,
      qty: 0,
      user: "John Doe",
      time: "Just now"
    };
    saveLogs([newLog, ...logs]);
  };

  const updateProduct = (id: number, updates: Partial<Omit<Product, "id">>) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const updatedProducts = products.map(p => {
      if (p.id === id) {
        const newQty = updates.qty !== undefined ? updates.qty : p.qty;
        return {
          ...p,
          ...updates,
          status: newQty <= 5 ? "Low Stock" : "In Stock"
        };
      }
      return p;
    });
    saveProducts(updatedProducts);

    const newLog: StockLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      item: product.name,
      change: updates.qty !== undefined ? `Updated to ${updates.qty} L` : "Details updated",
      qty: updates.qty !== undefined ? updates.qty : product.qty,
      user: "srivaksha_admin",
      time: "Just now"
    };
    saveLogs([newLog, ...logs]);
  };

  const processCheckout = (cartItems: { product: Product; quantity: number }[]) => {
    // 1. Deduct stock levels
    const updatedProducts = products.map(p => {
      const cartItem = cartItems.find(item => item.product.id === p.id);
      if (cartItem) {
        const nextQty = Math.max(0, p.qty - cartItem.quantity);
        return {
          ...p,
          qty: nextQty,
          status: nextQty <= 5 ? "Low Stock" : "In Stock"
        };
      }
      return p;
    });
    saveProducts(updatedProducts);

    // 2. Add stock logs
    const newLogs: StockLog[] = [];
    cartItems.forEach((item, index) => {
      const p = updatedProducts.find(prod => prod.id === item.product.id);
      newLogs.push({
        id: (logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1) + index,
        item: item.product.name,
        change: `-${item.quantity} L`,
        qty: p ? p.qty : 0,
        user: "John Doe",
        time: "Just now"
      });
    });
    saveLogs([...newLogs, ...logs]);
  };

  const adjustStock = (id: number, amount: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const nextQty = Math.max(0, product.qty + amount);
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          qty: nextQty,
          status: nextQty <= 5 ? "Low Stock" : "In Stock"
        };
      }
      return p;
    });
    saveProducts(updatedProducts);

    const newLog: StockLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      item: product.name,
      change: amount >= 0 ? `+${amount} L` : `${amount} L`,
      qty: nextQty,
      user: "John Doe",
      time: "Just now"
    };
    saveLogs([newLog, ...logs]);
  };

  return (
    <InventoryContext.Provider value={{ products, logs, isLoaded, activeBranch, setActiveBranch, addProduct, updateProduct, deleteProduct, processCheckout, adjustStock }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
