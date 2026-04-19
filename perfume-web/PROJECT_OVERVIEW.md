# The Olfactory Gallery - Perfume Website

A luxury perfume e-commerce website built with Next.js 16, React 19, Tailwind CSS 4, and TypeScript.

## ✨ Features Implemented

### 1. **Dark Luxury Theme**
- Primary background: `#0B0B0B` (near black)
- Secondary background: `#111111`
- Accent color: `#C9A24A` (gold)
- Smooth scrolling with custom scrollbar

### 2. **Fixed Navigation Bar**
- Hamburger menu (left) → opens side drawer
- Centered logo with brand name
- Search icon
- Shopping cart icon with badge
- Responsive design

### 3. **Hero Carousel**
- Auto-sliding carousel (3.5-second interval)
- Swipe support on mobile
- Previous/Next navigation buttons
- Indicator dots (active: gold, inactive: gray)
- Multiple slides with dynamic content

### 4. **Category Quick Access**
- 3 circular cards: MEN, WOMEN, ARABIC
- Hover effects (scale, shadow)
- Direct links to category pages

### 5. **Product Sections**
- Responsive grid:
  - **Mobile**: 2 products per row
  - **Tablet**: 3 products per row
  - **Desktop**: 4 products per row
- Product cards with:
  - Product image with hover zoom effect
  - Product name
  - Price in gold color
  - Original price with strikethrough (if on sale)
- Featured images grid below products
- "SEE MORE" buttons for each category

### 6. **Footer**
- Newsletter subscription section
- Links organized by category:
  - Customer Service
  - Featured
  - Follow Us
- Social media icons (Instagram, Facebook, Twitter)
- Copyright information

### 7. **Side Drawer Menu**
- Opens from left side
- Semi-transparent overlay backdrop
- Menu items: MEN, WOMEN, ARABIC
- Close button
- Prevents body scroll when open

## 📁 Project Structure

```
perfume-web/
├── app/
│   ├── page.tsx           # Main homepage
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Global styles & Tailwind config
├── components/
│   ├── Navbar.tsx         # Top navigation bar
│   ├── Hero.tsx           # Carousel section
│   ├── CategoryQuickAccess.tsx # Category cards
│   ├── ProductCard.tsx    # Individual product card
│   ├── ProductSection.tsx # Product grid with section
│   ├── SideDrawer.tsx     # Mobile menu drawer
│   └── Footer.tsx         # Footer with newsletter
├── public/                # Static assets
├── package.json
├── tsconfig.json          # TypeScript config with @ alias
└── next.config.ts
```

## 🎨 Design Details

### Typography
- **Headings**: Playfair Display (serif) - luxury feel
- **Body**: Lato (sans-serif) - clean readability

### Colors
- Primary Dark: `#0B0B0B`
- Secondary Dark: `#111111`
- Gold Accent: `#C9A24A`
- Text Primary: `#FFFFFF`
- Text Muted: `#AAAAAA`
- Border: `#222222`

### Spacing & Sizing
- 8px grid system
- Border radius: 6-10px
- Smooth transitions (0.3s ease)

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📦 Dependencies

- **Next.js 16.2.2** - React framework
- **React 19.2.4** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript 5** - Type safety

## 🔧 Component Customization

### Adding Products
Edit `app/page.tsx` and add items to the product arrays:
```typescript
const menProducts = [
  {
    id: 1,
    name: "Product Name",
    price: "$XX.XX",
    oldPrice: "$YY.YY", // optional
    image: "image-url",
  },
  // ...
];
```

### Changing Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --color-primary-dark: #0B0B0B;
  --color-accent-gold: #C9A24A;
  /* ... */
}
```

### Modifying Hero Slides
Edit the `slides` array in `components/Hero.tsx`:
```typescript
const slides: Slide[] = [
  {
    id: 1,
    title: "Your Title",
    subtitle: "Your Subtitle",
    image: "image-url",
  },
  // ...
];
```

## 🎯 Key Features

✅ Fully responsive (mobile-first)
✅ Dark luxe theme implemented
✅ Auto-scrolling hero carousel
✅ Product filtering by category
✅ Newsletter subscription form
✅ Smooth animations & transitions
✅ Accessibility features
✅ TypeScript support
✅ Tailwind CSS utility classes
✅ Custom font pairing

## 📝 Next Steps (Optional Enhancements)

- [ ] Connect to backend API for real product data
- [ ] Implement shopping cart functionality
- [ ] Add product detail pages
- [ ] Integrate payment gateway
- [ ] Add user authentication
- [ ] Implement product search
- [ ] Add wishlist feature
- [ ] Set up analytics

## 🐛 Troubleshooting

### Dev server won't start
```bash
npm install
npm run dev
```

### Build errors
```bash
npm run build
```

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

## 📧 Support

For questions or issues, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

**Built with ✨ for The Olfactory Gallery**
