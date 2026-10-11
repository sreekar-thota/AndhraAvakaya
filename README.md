# Andhra Avakaya — Premium Pickle Business Website

A modern, fast, and authentic website built for **Andhra Avakaya**, a traditional Andhra Pradesh homemade pickle brand.

---

## 🌟 Key Features

1. **Authentic Andhra Brand Aesthetics**:
   - Curated traditional color palette: Deep Chilli Red (`#8F2025`), Mango Yellow (`#F2B544`), Leaf Green (`#284B32`), Warm Cream (`#FFF8EC`), and Dark Brown (`#38271D`).
   - Rich typography utilizing *Cormorant Garamond* for traditional elegance and *Plus Jakarta Sans* for clean, modern readability.
   - High-end culinary photography showcasing authentic pickles in traditional ceramic Bharani jars, terracotta dishes, and brass vessels.

2. **Interactive Product Pop-Out Animation**:
   - Smooth layout expansion transition lifting selected pickle cards into an expanded focus view.
   - Subdued blurred backdrop overlay with smooth escape transitions.
   - Detailed recipe and preparation story, Telugu titles, spice intensity badge, traditional ingredients pills, and available weight options (`250g`, `500g`, `1kg`).
   - Fully accessible: closes on `Escape` key, backdrop click, or close button, and restores background scrolling cleanly.

3. **WhatsApp Click-to-Chat Integration**:
   - Centralized configuration in [`src/config/business.js`](./src/config/business.js).
   - Direct enquiry button with URL-encoded messages prefilled with product names (e.g. `Can I get more info about this product? Product: Traditional Andhra Avakaya.`).
   - Persistent floating WhatsApp contact button for quick enquiries on any device.

4. **Fully Responsive & Accessible**:
   - Optimized for mobile viewports (320px–430px), tablets (768px), and desktop displays (1024px–1440px+).
   - Mobile slide-in navigation drawer with smooth backdrop blur.
   - Respects `prefers-reduced-motion` settings.

---

## 📁 Project Structure

```text
├── public/
│   ├── images/
│   │   ├── logo.svg                   # Traditional Bharani jar & mango emblem
│   │   ├── hero_andhra_avakaya.jpg    # Authentic hero pickle spread
│   │   ├── avakaya_mango.jpg          # Traditional Andhra Avakaya
│   │   ├── bellam_avakaya.jpg         # Sweet & Spicy Bellam Avakaya
│   │   ├── gongura_pachadi.jpg        # Andhra Gongura Pachadi
│   │   ├── pandu_mirapa.jpg           # Pandu Mirapakaya Pachadi
│   │   ├── tomato_pachadi.jpg         # Tomato Nilava Pachadi
│   │   └── allam_pachadi.jpg          # Allam Pachadi (Ginger)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                 # Sticky header with mobile drawer & WhatsApp CTA
│   │   ├── Hero.jsx                   # Hero section with dual CTAs & culinary showcase
│   │   ├── About.jsx                  # Brand story & quality craft pillars
│   │   ├── ProductGrid.jsx            # Responsive pickle catalog with pop-out state
│   │   ├── ProductCard.jsx            # Individual pickle card with hover lift
│   │   ├── ProductPopOut.jsx          # Interactive pop-out modal with FLIP transition
│   │   ├── Contact.jsx                # Contact details & direct WhatsApp card
│   │   └── Footer.jsx                 # Quick navigation, back-to-top & copyright
│   ├── config/
│   │   └── business.js                # Central WhatsApp phone number & brand info
│   ├── data/
│   │   └── products.js                # Pickle menu data, weights, prices, & ingredients
│   ├── App.css                        # Component layouts, micro-animations & responsive queries
│   ├── App.jsx                        # Application root
│   ├── index.css                      # Global design system tokens & typography
│   └── main.jsx                       # React DOM entry
├── index.html                         # SEO meta tags, title & Google Fonts
├── package.json
└── vite.config.js
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

### Development Server
Run the local Vite development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
To create a production-optimized build:

```bash
npm run build
```

The output will be generated inside the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## ⚙️ Customization Guide

### 1. Setting Your Verified WhatsApp Business Number
Open [`src/config/business.js`](./src/config/business.js) and update the `WHATSAPP_NUMBER`:
```javascript
export const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Your verified international number (digits only)
```
All enquiry buttons and pop-out cards across the entire website will automatically use this verified number.

### 2. Updating Your Products & Pricing
Open [`src/data/products.js`](./src/data/products.js) to:
- Add new pickles or remove seasonal items.
- Update weights (e.g., `["250g", "500g", "1kg"]`).
- Update prices or pricing text (e.g. `approxPrice: "₹250"` or `priceDisplay: "Available on Enquiry"`).
- Modify ingredient lists or serving suggestions.

### 3. Replacing the Logo with Your Brand Logo
- Place your official logo file in `public/images/` (e.g., `public/images/official-logo.png`).
- In [`src/config/business.js`](./src/config/business.js), update:
```javascript
logoSrc: "/images/official-logo.png"
```

### 4. Updating Hero Accordion Gallery Images
Open [`src/data/gallery.js`](./src/data/gallery.js) and edit the `avakayaGalleryItems` array:
```javascript
export const avakayaGalleryItems = [
  {
    image: "/images/your-photo.jpg",
    label: "Panel Title",
    alt: "Image description"
  },
  // Add or edit panels here...
];
```
Place your image files in `public/images/` and reference them as `/images/your-filename.jpg`.

### 5. Updating About Us 3D DepthCarousel Images
Open [`src/data/aboutGallery.js`](./src/data/aboutGallery.js) and edit the `aboutGalleryItems` array:
```javascript
export const aboutGalleryItems = [
  {
    image: "/images/your-photo.jpg",
    alt: "Image description"
  },
  // Add or edit cards here...
];
```
Place your image files in `public/images/` and reference them as `/images/your-filename.jpg`.
