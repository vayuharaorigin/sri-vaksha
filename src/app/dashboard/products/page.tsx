"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  Check, 
  Upload, 
  AlertCircle,
  Paintbrush
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Mock Products Data
const initialProducts = [
  { id: 1, name: "Royal Satin Blue", category: "Interior Paint", sku: "PF-RSB-01", qty: 24, price: 45.00, status: "In Stock", rgb: "#1E3A8A" },
  { id: 2, name: "Matte Crimson Accent", category: "Interior Paint", sku: "PF-MCA-02", qty: 3, price: 52.00, status: "Low Stock", rgb: "#EF4444" },
  { id: 3, name: "Classic Navy Matte", category: "Wall Paint", sku: "PF-CNM-03", qty: 142, price: 38.00, status: "In Stock", rgb: "#1e293b" },
  { id: 4, name: "EcoPure Primer White", category: "Primers", sku: "PF-EPW-04", qty: 5, price: 29.99, status: "Low Stock", rgb: "#f8fafc" },
  { id: 5, name: "Warm Beige Silk", category: "Interior Paint", sku: "PF-WBS-05", qty: 84, price: 40.00, status: "In Stock", rgb: "#d97706" },
  { id: 6, name: "Forest Canopy Satin", category: "Exterior Paint", sku: "PF-FCS-06", qty: 18, price: 48.00, status: "In Stock", rgb: "#065f46" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // Add Product State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Interior Paint");
  const [newProductSKU, setNewProductSKU] = useState("");
  const [newProductQty, setNewProductQty] = useState(10);
  const [newProductPrice, setNewProductPrice] = useState(35.00);
  const [newProductColor, setNewProductColor] = useState("#3B82F6");

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Interior Paint", "Exterior Paint", "Wall Paint", "Primers"];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductSKU) return;

    const newProduct = {
      id: products.length + 1,
      name: newProductName,
      category: newProductCategory,
      sku: newProductSKU,
      qty: Number(newProductQty),
      price: Number(newProductPrice),
      status: Number(newProductQty) <= 5 ? "Low Stock" : "In Stock",
      rgb: newProductColor
    };

    setProducts([newProduct, ...products]);
    setIsAddOpen(false);

    // Reset Form
    setNewProductName("");
    setNewProductSKU("");
    setNewProductQty(10);
    setNewProductPrice(35.00);
    setNewProductColor("#3B82F6");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage and update your paint catalog.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 rounded-2xl shadow-sm">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search name, SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-white dark:bg-card border-border shadow-sm focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
            <SlidersHorizontal size={16} />
            Filter Category:
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filterCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-white hover:bg-secondary border-border text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table Card */}
      <Card className="overflow-hidden border border-border bg-card shadow-sm rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px]">Swatch</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell>
                    <div 
                      className="w-10 h-10 rounded-xl shadow-inner border border-black/10" 
                      style={{ backgroundColor: product.rgb }} 
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-right font-medium">{product.qty} L</TableCell>
                  <TableCell className="text-right font-semibold">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "In Stock" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        product.status === "In Stock" ? "bg-green-600" : "bg-red-600"
                      }`} />
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-secondary">
                        <Edit3 size={15} className="text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-destructive text-muted-foreground"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-[800px] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5"
            >
              {/* Left 3 cols: Form */}
              <div className="md:col-span-3 p-8 md:p-10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                  <p className="text-sm text-muted-foreground">Add a premium color to the shop inventory.</p>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Product Name</label>
                    <Input 
                      placeholder="e.g. Royal Satin Blue" 
                      value={newProductName} 
                      onChange={(e) => setNewProductName(e.target.value)} 
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">SKU Code</label>
                      <Input 
                        placeholder="e.g. PF-RSB-01" 
                        value={newProductSKU} 
                        onChange={(e) => setNewProductSKU(e.target.value)} 
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Category</label>
                      <select 
                        value={newProductCategory} 
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="flex h-12 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <option value="Interior Paint">Interior Paint</option>
                        <option value="Exterior Paint">Exterior Paint</option>
                        <option value="Wall Paint">Wall Paint</option>
                        <option value="Primers">Primers</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Stock Volume (Liters)</label>
                      <Input 
                        type="number" 
                        value={newProductQty} 
                        onChange={(e) => setNewProductQty(Number(e.target.value))} 
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Unit Price ($)</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={newProductPrice} 
                        onChange={(e) => setNewProductPrice(Number(e.target.value))} 
                        required
                      />
                    </div>
                  </div>

                  {/* Swatch Pick */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Hex Color Swatch</label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={newProductColor} 
                        onChange={(e) => setNewProductColor(e.target.value)} 
                        className="w-12 h-12 p-0 rounded-xl overflow-hidden border-none"
                      />
                      <Input 
                        type="text" 
                        value={newProductColor} 
                        onChange={(e) => setNewProductColor(e.target.value)} 
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl h-11">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground rounded-xl h-11">
                      Save Product
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right 2 cols: Live Preview */}
              <div className="md:col-span-2 bg-[#F8FAFC] dark:bg-[#09090b]/40 border-l border-border p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Card Preview</h3>
                  <p className="text-xs text-muted-foreground mt-1">This is how your paint look card will present.</p>
                </div>

                {/* Preview Swatch Design */}
                <div className="bg-card border border-border shadow-lg rounded-[2rem] overflow-hidden p-6 space-y-4">
                  <div 
                    className="w-full h-40 rounded-2xl flex items-center justify-center text-white relative shadow-inner overflow-hidden border"
                    style={{ backgroundColor: newProductColor || "#ccc" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Paintbrush size={48} className="drop-shadow-lg" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-lg truncate max-w-[140px]">{newProductName || "Product Name"}</h4>
                      <span className="text-sm font-semibold">${(newProductPrice || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{newProductCategory}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {newProductSKU || "SKU-CODE"}
                      </span>
                      <span className={`text-xs font-semibold ${newProductQty <= 5 ? "text-red-500" : "text-green-600"}`}>
                        {newProductQty || 0} L left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-muted-foreground">
                  Changes sync instantly with local memory.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
