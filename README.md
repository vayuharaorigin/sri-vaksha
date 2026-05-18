# 🎨 PaintFlow

> A premium, high-fidelity administrative SaaS hub and POS checkout platform designed for paint manufacturers, custom shop mixing stations, and retail outlets. Inspired by the visual elegance and operational efficiency of Shopify, Stripe, and Apple.

---

## ⚡ Standalone Offline Edition (`index.html`)

**The ultimate zero-dependency, single-file edition of PaintFlow!** You can run the entire operation center by simply double-clicking this file inside your file manager. No installation, Node.js, or dev servers required!

### 📦 Key Features
*   **Zero Dependencies / Offline Mobility**: Uses Tailwind CSS & Lucide icons via high-speed CDNs.
*   **Fully Stateful POS Terminal**: Dynamic cart modifiers (`+1L`, `+5L`, `+10L`), automatic sales tax calculations (8%), and live stock ledger adjustments.
*   **Split-Pane Invoice Checkout**: Presents a beautiful dual-panel modal showcasing the payment confirmation details and a digital shop receipt with color swatches.
*   **Browser-Native Print Isolation**: Clicking **Print Invoice Bill** triggers standard `window.print()`. Custom `@media print` CSS isolating rules strip out all dashboard sidebars and menus, printing a perfect paper receipt.
*   **Swatch Creator Modal**: Includes a Hex color picker and real-time live preview cards.
*   **Custom Canvas Drawing Engine**: Hand-crafted native HTML Canvas splines that draw smooth gradient area curves for weekly sales and profits without needing bulky chart libraries.
*   **Active Dark Mode**: Seamless toggle in Settings to switch the entire application between light sand and dark zinc themes.

---

## 🚀 Next.js Enterprise Edition (`src/`)

An enterprise-grade administrative hub bootstrapped with **Next.js**, **React**, **Tailwind CSS**, and **TypeScript**.

### 🛠️ Technology Stack
*   **Core**: Next.js 15 (App Router), React 19, TypeScript
*   **Styling**: Tailwind CSS for high-fidelity animations, transitions, and glassmorphism.
*   **Icons**: Lucide React

### 📂 Directory Architecture
*   `src/app/login/` — Abstract animated mesh gradient portal.
*   `src/app/dashboard/` — Stripe-inspired layout with responsive navigation sidebar.
*   `src/app/dashboard/products/` — Interactive product catalog swatch lists.
*   `src/app/dashboard/sell/` — POS checkout terminal with split-pane invoice drawers.
*   `src/app/dashboard/inventory/` — Real-time adjustment ledger history logs.
*   `src/app/dashboard/analytics/` — Financial sparklines and category bar pillars.
*   `src/app/dashboard/reports/` — Audit download centers.
*   `src/app/dashboard/settings/` — Preferences panel and master Dark Mode toggles.

---

## 💻 Getting Started (Next.js Edition)

### 1. Installation
Install dependencies inside the project root:
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Open App
Navigate to [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 📄 License
This project is proprietary and customized exclusively for **Vayuhara Origin**.
