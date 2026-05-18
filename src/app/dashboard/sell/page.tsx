"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  User, 
  CreditCard, 
  FileText 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock Products
const posProducts = [
  { id: 1, name: "Royal Satin Blue", sku: "PF-RSB-01", price: 45.00, qty: 24, rgb: "#1E3A8A" },
  { id: 2, name: "Matte Crimson Accent", sku: "PF-MCA-02", price: 52.00, qty: 3, rgb: "#EF4444" },
  { id: 3, name: "Classic Navy Matte", sku: "PF-CNM-03", price: 38.00, qty: 142, rgb: "#1e293b" },
  { id: 4, name: "EcoPure Primer White", sku: "PF-EPW-04", price: 29.99, qty: 5, rgb: "#f8fafc" },
  { id: 5, name: "Warm Beige Silk", sku: "PF-WBS-05", price: 40.00, qty: 84, rgb: "#d97706" },
  { id: 6, name: "Forest Canopy Satin", sku: "PF-FCS-06", price: 48.00, qty: 18, rgb: "#065f46" },
];

export default function SellPage() {
  const [products, setProducts] = useState(posProducts);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ product: typeof posProducts[0]; quantity: number }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [completedInvoice, setCompletedInvoice] = useState<{
    id: string;
    items: { name: string; sku: string; price: number; quantity: number; rgb: string }[];
    subtotal: number;
    tax: number;
    total: number;
    date: string;
  } | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof posProducts[0], qtyToAdd = 1) => {
    if (product.qty <= 0) return;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity + qtyToAdd > product.qty) return;
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + qtyToAdd } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: qtyToAdd }]);
    }
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === id) {
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) return null;
        if (nextQty > item.product.qty) return item;
        return { ...item, quantity: nextQty };
      }
      return item;
    }).filter(Boolean) as any);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.product.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const currentInvoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceItems = cart.map(item => ({
      name: item.product.name,
      sku: item.product.sku,
      price: item.product.price,
      quantity: item.quantity,
      rgb: item.product.rgb,
    }));
    const subtotal = total;
    const tax = total * 0.08;
    const finalTotal = total * 1.08;

    setCompletedInvoice({
      id: currentInvoiceId,
      items: invoiceItems,
      subtotal,
      tax,
      total: finalTotal,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
    });

    // Deduct stock
    setProducts(products.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, qty: p.qty - cartItem.quantity };
      }
      return p;
    }));

    setInvoiceId(currentInvoiceId);
    setShowSuccess(true);
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
      {/* Left 2 Cols: POS Product Grid */}
      <div className="lg:col-span-2 space-y-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sell Paint</h1>
          <p className="text-muted-foreground mt-1">Select products and configure bulk sales.</p>
        </div>

        {/* Large Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search by color name, code or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-white dark:bg-card border-none shadow-sm rounded-2xl text-base ring-1 ring-border focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        {/* Grid of Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const outOfStock = product.qty <= 0;
            return (
              <Card key={product.id} className="overflow-hidden border border-border group relative">
                {outOfStock && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <span className="bg-destructive text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                  </div>
                )}
                
                {/* Paint Color Box */}
                <div 
                  className="w-full h-28 border-b relative" 
                  style={{ backgroundColor: product.rgb }}
                >
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {product.sku}
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-sm font-bold text-accent">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">{product.qty} L left</span>
                    </div>
                  </div>

                  {/* Sell Buttons */}
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="text-xs h-8 px-0" 
                      disabled={outOfStock}
                      onClick={() => addToCart(product, 1)}
                    >
                      +1L
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="text-xs h-8 px-0" 
                      disabled={product.qty < 5}
                      onClick={() => addToCart(product, 5)}
                    >
                      +5L
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="text-xs h-8 px-0" 
                      disabled={product.qty < 10}
                      onClick={() => addToCart(product, 10)}
                    >
                      +10L
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right Col: POS Checkout Cart */}
      <div className="space-y-6 print:hidden">
        <Card className="sticky top-24 border border-border bg-card shadow-sm rounded-3xl overflow-hidden flex flex-col max-h-[calc(100vh-140px)]">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart size={18} className="text-accent" />
              Checkout Cart
            </h2>
            <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">{cart.length} items</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[250px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10">
                <ShoppingCart size={40} className="text-muted-foreground/30" />
                <p className="text-sm font-semibold text-muted-foreground">Your cart is empty</p>
                <p className="text-xs text-muted-foreground/60">Click "+L" buttons on products to begin.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div 
                    className="w-10 h-10 rounded-xl border border-black/10 flex-shrink-0" 
                    style={{ backgroundColor: item.product.rgb }} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)} / L</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-7 h-7 rounded-lg"
                      onClick={() => updateCartQty(item.product.id, -1)}
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-7 h-7 rounded-lg"
                      onClick={() => updateCartQty(item.product.id, 1)}
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-muted-foreground hover:text-destructive rounded-lg"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Checkout */}
          <div className="p-6 border-t bg-secondary/20 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-foreground pt-1.5 border-t">
                <span>Total Due</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-2xl font-bold shadow-md"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Checkout Order
            </Button>
          </div>
        </Card>
      </div>

      {/* Interactive Bill / Success Split Modal */}
      <AnimatePresence>
        {showSuccess && completedInvoice && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 print:hidden">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-[850px] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 h-[90vh] max-h-[680px]"
            >
              {/* Left 2 Cols: Success Meta */}
              <div className="md:col-span-2 p-8 flex flex-col justify-between items-center text-center border-r">
                <div className="space-y-6 my-auto">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                      <CheckCircle size={36} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Sale Completed</h2>
                    <p className="text-sm text-muted-foreground">The billing details have been locked and stock levels decremented.</p>
                  </div>
                  
                  <div className="bg-secondary/40 py-3 px-4 rounded-2xl text-left space-y-1 w-full max-w-[260px] mx-auto text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Invoice ID</span><span className="font-mono font-bold">{completedInvoice.id}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-semibold text-accent">${completedInvoice.total.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="w-full space-y-2.5 mt-4">
                  <Button onClick={triggerPrint} variant="gradient" className="w-full h-11 rounded-xl gap-2 font-bold shadow">
                    <FileText size={16} />
                    Print Invoice Bill
                  </Button>
                  <Button onClick={() => setShowSuccess(false)} variant="outline" className="w-full h-11 rounded-xl">
                    Dismiss View
                  </Button>
                </div>
              </div>

              {/* Right 3 Cols: High-fidelity Live Bill Sheet */}
              <div className="md:col-span-3 bg-secondary/15 p-8 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Bill Header */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h3 className="font-bold text-xl tracking-tight text-foreground">PaintFlow Inc.</h3>
                      <p className="text-[11px] text-muted-foreground">100 Luxury Avenue, New York, NY</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-extrabold tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full">Paid Receipt</span>
                      <p className="text-[10px] text-muted-foreground mt-1.5">{completedInvoice.date}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs space-y-0.5">
                    <p className="text-muted-foreground">Billed To:</p>
                    <p className="font-bold text-foreground">Counter Customer (Walk-in)</p>
                    <p className="text-muted-foreground text-[10px]">Payment Mode: Card Transaction</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purchase Breakdown</p>
                    <div className="space-y-2">
                      {completedInvoice.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-2 border-b last:border-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: item.rgb }} />
                            <div className="truncate">
                              <p className="font-bold text-foreground truncate">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{item.sku}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-3">
                            <p className="font-bold">{item.quantity} L x ${item.price.toFixed(2)}</p>
                            <p className="text-[10px] text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Final Total Summary */}
                <div className="border-t pt-4 mt-6 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${completedInvoice.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Sales Tax (8%)</span><span>${completedInvoice.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-extrabold text-foreground border-t pt-2">
                    <span>Total Paid</span>
                    <span>${completedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pure Print-only document layout (visible only on window.print()) */}
      {completedInvoice && (
        <div className="hidden print:block bg-white text-black p-8 max-w-[800px] mx-auto space-y-8 font-sans">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">PaintFlow</h1>
              <p className="text-sm text-gray-500 mt-1">Premium Paint & Coatings Shop</p>
              <p className="text-xs text-gray-400 mt-0.5">100 Luxury Avenue, New York, NY</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-700">INVOICE</h2>
              <p className="text-xs text-gray-500 mt-1">Invoice ID: {completedInvoice.id}</p>
              <p className="text-xs text-gray-500">Date: {completedInvoice.date}</p>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <h3 className="font-semibold text-gray-700">Billed To:</h3>
            <p className="text-gray-500">Counter Customer (Walk-in)</p>
            <p className="text-gray-400">Payment: Card Transaction</p>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3">Swatch</th>
                <th className="py-3">Item Name</th>
                <th className="py-3">SKU</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-right">Volume</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {completedInvoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 text-gray-700">
                  <td className="py-3.5">
                    <span className="w-5 h-5 rounded-full inline-block border border-gray-200" style={{ backgroundColor: item.rgb }} />
                  </td>
                  <td className="py-3.5 font-medium">{item.name}</td>
                  <td className="py-3.5 font-mono text-xs text-gray-400">{item.sku}</td>
                  <td className="py-3.5 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3.5 text-right">{item.quantity} L</td>
                  <td className="py-3.5 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${completedInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sales Tax (8%)</span>
                <span>${completedInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t pt-2 text-base">
                <span>Total Paid</span>
                <span>${completedInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 pt-16 border-t">
            <p>Thank you for shopping at PaintFlow!</p>
            <p className="mt-1">For support or queries, contact us at contact@paintflow.co</p>
          </div>
        </div>
      )}
    </div>
  );
}
