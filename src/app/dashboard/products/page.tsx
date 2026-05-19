"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  Paintbrush,
  X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useInventory } from "@/context/InventoryContext";
import { Product } from "@/context/InventoryContext";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
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

  // Edit Product State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Interior Paint");
  const [editSKU, setEditSKU] = useState("");
  const [editQty, setEditQty] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [editColor, setEditColor] = useState("#3B82F6");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Interior Paint", "Exterior Paint", "Wall Paint", "Primers"];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductSKU) return;
    addProduct({ name: newProductName, category: newProductCategory, sku: newProductSKU, qty: Number(newProductQty), price: Number(newProductPrice), rgb: newProductColor });
    setIsAddOpen(false);
    setNewProductName(""); setNewProductSKU(""); setNewProductQty(10); setNewProductPrice(35.00); setNewProductColor("#3B82F6");
  };

  const handleOpenEdit = (product: Product) => {
    setEditProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditSKU(product.sku);
    setEditQty(product.qty);
    setEditPrice(product.price);
    setEditColor(product.rgb);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    updateProduct(editProduct.id, {
      name: editName,
      category: editCategory,
      sku: editSKU,
      qty: Number(editQty),
      price: Number(editPrice),
      rgb: editColor,
    });
    setIsEditOpen(false);
    setEditProduct(null);
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
            Filter:
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

      {/* Products Table */}
      <Card className="overflow-hidden border border-border bg-card shadow-sm rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px]">Swatch</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Qty (L)</TableHead>
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
                    <div className="w-10 h-10 rounded-xl shadow-inner border border-black/10" style={{ backgroundColor: product.rgb }} />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-right font-medium">{product.qty} L</TableCell>
                  <TableCell className="text-right font-semibold">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "In Stock" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.status === "In Stock" ? "bg-green-600" : "bg-red-600"}`} />
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEdit(product)}
                        className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-muted-foreground"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteProduct(product.id)}
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

      {/* ===== EDIT PRODUCT MODAL ===== */}
      <AnimatePresence>
        {isEditOpen && editProduct && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-[740px] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5"
            >
              {/* Form */}
              <div className="md:col-span-3 p-8 md:p-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
                    <p className="text-sm text-muted-foreground mt-1">Update stock, price, or product details.</p>
                  </div>
                  <button onClick={() => setIsEditOpen(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Product Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">SKU Code</label>
                      <Input value={editSKU} onChange={(e) => setEditSKU(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Category</label>
                      <select 
                        value={editCategory} 
                        onChange={(e) => setEditCategory(e.target.value)}
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
                        min={0}
                        value={editQty} 
                        onChange={(e) => setEditQty(Number(e.target.value))} 
                        required 
                        className="font-semibold text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Unit Price (₹)</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={editPrice} 
                        onChange={(e) => setEditPrice(Number(e.target.value))} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Hex Color Swatch</label>
                    <div className="flex items-center gap-3">
                      <Input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="w-12 h-12 p-0 rounded-xl overflow-hidden border-none" />
                      <Input type="text" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl h-11">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground rounded-xl h-11 px-6">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>

              {/* Live Preview */}
              <div className="md:col-span-2 bg-[#F8FAFC] dark:bg-[#09090b]/40 border-l border-border p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                  <p className="text-xs text-muted-foreground mt-1">See your changes in real time.</p>
                </div>

                <div className="bg-card border border-border shadow-lg rounded-[2rem] overflow-hidden p-6 space-y-4">
                  <div 
                    className="w-full h-40 rounded-2xl flex items-center justify-center text-white relative shadow-inner overflow-hidden border"
                    style={{ backgroundColor: editColor || "#ccc" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Paintbrush size={48} className="drop-shadow-lg" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-lg truncate max-w-[140px]">{editName || "Product Name"}</h4>
                      <span className="text-sm font-semibold">₹{(editPrice || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{editCategory}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{editSKU || "SKU-CODE"}</span>
                      <span className={`text-xs font-semibold ${editQty <= 5 ? "text-red-500" : "text-green-600"}`}>
                        {editQty || 0} L left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-muted-foreground">Changes sync instantly with local memory.</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== ADD PRODUCT MODAL ===== */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-[800px] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5"
            >
              <div className="md:col-span-3 p-8 md:p-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                    <p className="text-sm text-muted-foreground">Add a premium color to the shop inventory.</p>
                  </div>
                  <button onClick={() => setIsAddOpen(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Product Name</label>
                    <Input placeholder="e.g. Royal Satin Blue" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">SKU Code</label>
                      <Input placeholder="e.g. PF-RSB-01" value={newProductSKU} onChange={(e) => setNewProductSKU(e.target.value)} required />
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
                      <Input type="number" value={newProductQty} onChange={(e) => setNewProductQty(Number(e.target.value))} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Unit Price (₹)</label>
                      <Input type="number" step="0.01" value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Hex Color Swatch</label>
                    <div className="flex items-center gap-3">
                      <Input type="color" value={newProductColor} onChange={(e) => setNewProductColor(e.target.value)} className="w-12 h-12 p-0 rounded-xl overflow-hidden border-none" />
                      <Input type="text" value={newProductColor} onChange={(e) => setNewProductColor(e.target.value)} placeholder="#3B82F6" className="flex-1" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl h-11">Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground rounded-xl h-11">Save Product</Button>
                  </div>
                </form>
              </div>

              <div className="md:col-span-2 bg-[#F8FAFC] dark:bg-[#09090b]/40 border-l border-border p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Card Preview</h3>
                  <p className="text-xs text-muted-foreground mt-1">This is how your paint look card will present.</p>
                </div>
                <div className="bg-card border border-border shadow-lg rounded-[2rem] overflow-hidden p-6 space-y-4">
                  <div className="w-full h-40 rounded-2xl flex items-center justify-center text-white relative shadow-inner overflow-hidden border" style={{ backgroundColor: newProductColor || "#ccc" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Paintbrush size={48} className="drop-shadow-lg" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-lg truncate max-w-[140px]">{newProductName || "Product Name"}</h4>
                      <span className="text-sm font-semibold">₹{(newProductPrice || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{newProductCategory}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{newProductSKU || "SKU-CODE"}</span>
                      <span className={`text-xs font-semibold ${newProductQty <= 5 ? "text-red-500" : "text-green-600"}`}>{newProductQty || 0} L left</span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-[10px] text-muted-foreground">Changes sync instantly with local memory.</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
