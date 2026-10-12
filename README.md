# Andhra Avakaya — Premium Pickle Website & Admin Stock Management

A modern, fast, and authentic website built for **Andhra Avakaya**, a traditional Andhra Pradesh homemade pickle brand, complete with a password-protected admin stock and availability management system.

---

## 🌟 Key Features

1. **Authentic Andhra Brand Aesthetics**:
   - Curated traditional color palette: Deep Chilli Red (`#8F2025`), Mango Yellow (`#F2B544`), Leaf Green (`#284B32`), Warm Cream (`#FFF8EC`), and Dark Brown (`#38271D`).
   - Rich typography utilizing *Cormorant Garamond* / *Playfair Display* for traditional elegance and *Plus Jakarta Sans* for clean readability.
   - High-end culinary food photography showcasing all 20 authentic Andhra pickles.

2. **Full 20-Product Pickle Catalog (Veg & Non-Veg)**:
   - **Vegetarian Pickles (9 items):** Avakaya Pickle, Menthi Avakaya Pickle, Maagaya Pickle, Usirikaya Pickle, Allam Pachadi, Gongura Pachadi, Tomato Pachadi, Nalleru Kada Pachadi, Cauliflower Pachadi.
   - **Non-Vegetarian Pickles (11 items):** Chicken Pickle, Prawns Pickle, Mutton Pickle, Fish Pickle, Gongura Chicken Bone Pickle, Gongura Chicken Boneless Pickle, Gongura Prawns Pickle, Gongura Mutton Pickle, Gongura Mutton Boneless Pickle, Country Chicken Pickle, Crab Pickle.
   - Package size selectors (`250 g`, `500 g`, `1 kg`) with dynamic price calculations.

3. **Secure Admin Stock Management System**:
   - **Hidden 3-Click Access:** Click the Andhra Avakaya brand logo in the header 3 times consecutively to open the admin login modal directly on the current page without URL navigation.
   - **Dedicated Admin Page:** Accessible via `/admin` with a full-screen layout.
   - **Authentication & Security:**
     - Timing-safe credential comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
     - Salted `scrypt` password hashing.
     - HMAC-SHA256 tamper-proof signed session tokens stored in secure `HttpOnly; SameSite=Lax` cookies.
     - Protected backend endpoints (`/api/admin/stock`, `/api/admin/check-auth`) rejecting unauthorized calls with HTTP 401.
   - **Admin Inventory Dashboard:**
     - Titled **Admin Dashboard**.
     - Grouped into separate sections for **Veg Pickles (9)** and **Non-Veg Pickles (11)**.
     - Product food photography, Telugu and English titles, reference prices, and quantity price breakdown (`250 g`, `500 g`, `1 kg`).
     - Real-time stock status toggles: **In Stock** (green) / **Out of Stock** (red).
     - Optional custom stock note field (e.g., *"Fresh batch arriving tomorrow"*).
     - Bulk category actions ("All In Stock" / "All Out of Stock").
     - Search bar and stock status filters.
     - Save/update functionality persisting changes to `data/stock.json`.
     - Secure logout button.

4. **Live Public Storefront Stock Synchronization**:
   - Changes made in the Admin Dashboard immediately update product cards on the public website via `StockContext`.
   - **In Stock:** Displays an attractive green `"In Stock"` pill badge with check icon; customers can select package sizes and send WhatsApp enquiries normally.
   - **Out of Stock:** Displays a prominent red `"Out of Stock"` badge with soft pulse animation; disables package size selectors, displays custom stock note, and replaces the enquiry button with a disabled `"Currently Unavailable"` button.

5. **WhatsApp Click-to-Chat Integration**:
   - Centralized configuration in [`src/config/business.js`](./src/config/business.js).
   - Direct purchase enquiry buttons prefilled with the selected pickle name, package size, and calculated price.
   - Persistent floating WhatsApp contact button for instant support.

---

## 🔐 Admin Access & Credentials

### Default Credentials (Configurable in `.env`)
- **Username:** `uday`
- **Password:** `uday0309`

### How to Access the Admin Portal

- **Method 1 (Hidden In-Page Modal):** Visit the website (`http://localhost:5173/`) and click the top-left **Andhra Avakaya logo 3 times consecutively**. The `Admin Login` modal will open right on the homepage.
- **Method 2 (Dedicated Page):** Navigate directly to `http://localhost:5173/admin`.

---

## 📁 Project Structure

```text
├── api/                               # Vercel Serverless Function Endpoints
│   ├── stock.js                       # GET /api/stock (Public inventory data)
│   └── admin/
│       ├── check-auth.js              # GET /api/admin/check-auth (Session verify)
│       ├── login.js                   # POST /api/admin/login (Auth & cookie issue)
│       ├── logout.js                  # POST /api/admin/logout (Session clear)
│       └── stock.js                   # POST /api/admin/stock (Protected stock update)
├── data/
│   └── stock.json                     # Shared persistent JSON inventory store
├── public/
│   └── images/
│       ├── logo.svg                   # Brand emblem logo
│       └── pickles/                   # High-res photography for all 20 pickles
│           ├── veg/                   # 9 Vegetarian pickle photos
│           └── nonveg/                # 11 Non-Vegetarian pickle photos
├── server/
│   ├── apiHandler.js                  # Central Connect & Express API router
│   ├── auth.js                        # scrypt password hashing & session management
│   └── stockService.js                # Atomic file-backed stock read/write operations
├── server.js                          # Standalone Node.js production server
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminApp.jsx           # Standalone /admin router & session guard
│   │   │   ├── AdminLogin.jsx         # Standalone admin login page
│   │   │   ├── AdminLoginModal.jsx    # In-page 3-click logo Admin Login modal
│   │   │   ├── AdminDashboard.jsx     # Standalone stock management dashboard
│   │   │   ├── AdminDashboardModal.jsx# In-page stock management dashboard modal
│   │   │   └── AdminStyles.css        # Admin portal brand styling
│   │   ├── Navbar.jsx                 # Header with 3-click logo trigger & mobile drawer
│   │   ├── Hero.jsx                   # Hero section with dual CTAs & culinary showcase
│   │   ├── About.jsx                  # Brand story & quality craft pillars
│   │   ├── ProductGrid.jsx            # Responsive pickle catalog with category tabs
│   │   ├── ProductCard.jsx            # Individual pickle card with stock badge stacking
│   │   ├── ProductPopOut.jsx          # Interactive recipe modal with FLIP animation
│   │   ├── Contact.jsx                # Contact details & direct WhatsApp card
│   │   ├── WelcomeIntro.jsx           # Initial animated welcome splash
│   │   └── Footer.jsx                 # Quick navigation, back-to-top & copyright
│   ├── config/
│   │   └── business.js                # Central WhatsApp phone number & brand info
│   ├── context/
│   │   └── StockContext.jsx           # Real-time stock context provider & poller
│   ├── data/
│   │   └── products.js                # Source of truth: 20 pickles, prices & descriptions
│   ├── App.css                        # Design system, layout, & stock badge styles
│   ├── App.jsx                        # Application root with modal & route orchestrator
│   ├── index.css                      # Global tokens & typography
│   └── main.jsx                       # React DOM entry
├── .env.example                       # Environment variables template
├── index.html                         # HTML template & Google Fonts
├── package.json
└── vite.config.js                     # Vite config with custom local API middleware
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
Clone or navigate to the project root directory and run:

```bash
npm install
```

### Environment Configuration
Copy the template file to `.env`:

```bash
cp .env.example .env
```

The default credentials inside `.env`:
```env
ADMIN_USERNAME=uday
ADMIN_PASSWORD_HASH=64596425ea607dd0d22a30dbdf6478de:3c94ea66868b95cba487c2648b095f9635baaeb3ad09da76e7852370bf814772c6ba123526a668f7a64ff8c7a1a7c889a21ff77367155f83543113129f02336a
SESSION_SECRET=c8f3e2b9a7104f6e85293d14ab529e847c130d7b29a174c82b95107e324efb18
```

### Running Locally (Development)
Run the Vite development server (includes integrated API middleware):

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

- Click the logo **3 times** to open the Admin Login modal.
- Or visit [http://localhost:5173/admin](http://localhost:5173/admin) directly.

### Production Build & Standalone Server
To build the production client and run the standalone Node server:

```bash
npm run build
npm run start
```

The production server starts on port `3001` or `5000` (configurable via `PORT` in `.env`).

---

## ⚙️ Customization Guide

### 1. Setting Your Verified WhatsApp Business Number
Open [`src/config/business.js`](./src/config/business.js) and update the `WHATSAPP_NUMBER`:
```javascript
export const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Your verified international number (digits only)
```

### 2. Changing Admin Credentials
To change the admin password, generate a salted `scrypt` hash:
```bash
node -e "const crypto = require('crypto'); const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync('your_new_password', salt, 64).toString('hex'); console.log(salt + ':' + hash);"
```
Copy the printed output and update `ADMIN_PASSWORD_HASH` in `.env`.

### 3. Vercel Deployment
The repository includes preconfigured Vercel serverless handlers in the `api/` directory (`api/stock.js`, `api/admin/*.js`) that deploy automatically alongside the React static frontend.
