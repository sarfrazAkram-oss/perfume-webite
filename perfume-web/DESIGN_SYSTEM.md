# Design System Reference

## Color Palette

### Primary Colors
- **Dark Background**: `#0B0B0B` (rgb(11, 11, 11))
- **Secondary Background**: `#111111` (rgb(17, 17, 17))
- **Gold Accent**: `#C9A24A` (rgb(201, 162, 74))

### Text Colors
- **Primary Text**: `#FFFFFF` (white)
- **Secondary/Muted**: `#AAAAAA` (rgb(170, 170, 170))
- **Subtle**: `#666666` (rgb(102, 102, 102))

### Borders
- **Primary Border**: `#222222` (rgb(34, 34, 34))
- **Hover Border**: `#333333` (rgb(51, 51, 51))

## CSS Variables

Access in components:
```css
var(--color-primary-dark)
var(--color-secondary-dark)
var(--color-accent-gold)
var(--color-text-primary)
var(--color-text-muted)
var(--color-border)
```

## Tailwind Utilities

### Custom Classes (in globals.css)

```css
/* Gold text styling */
.gold-text { color: #C9A24A; }

/* Gold border styling */
.gold-border { border-color: #C9A24A; }

/* Luxury heading style */
.luxury-heading {
  font-family: Playfair Display (serif);
  font-size: clamp(20px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: 2px;
  color: #FFFFFF;
}

/* Ghost button (transparent with gold border) */
.button-ghost {
  background-color: transparent;
  border: 1px solid #C9A24A;
  color: #C9A24A;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button-ghost:hover {
  background-color: #C9A24A;
  color: #0B0B0B;
}

/* Thin divider line */
.divider {
  height: 1px;
  background-color: #222222;
  margin: 20px 0;
}
```

## Fonts

### Headings (Playfair Display)
- Serif, elegant, luxury appearance
- Weights: 400, 500, 600, 700, 800, 900
- Use for: h1, h2, h3, titles

```tsx
<h1 className="luxury-heading">Winter Sale</h1>
```

### Body Text (Lato)
- Sans-serif, clean, readable
- Weights: 300, 400, 700, 900
- Use for: paragraphs, descriptions, labels

```tsx
<p className="text-white">Description text here</p>
```

## Spacing Scale

8px grid system:
- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px
- `p-12` = 48px
- `p-16` = 64px

## Border Radius

```css
rounded-lg /* 8px */
rounded-full /* 50% - circles */
```

## Transitions

Standard animation timing:
```css
transition-all duration-300 ease-in-out
transition-colors duration-300 ease
```

## Responsive Breakpoints

```
sm: 640px   (tablet)
md: 768px   (tablet+)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

### Usage Examples

```tsx
/* Mobile: 2 columns, Tablet+: 3 columns, Desktop: 4 columns */
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

/* Hide on mobile, show on tablet+ */
<div className="hidden sm:block">

/* Adjust text size responsively */
<h1 className="text-2xl sm:text-3xl md:text-4xl">
```

## Component Example

```tsx
// Using the design system
export default function Example() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0B0B0B]">
      <h2 className="luxury-heading mb-8">Collection</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Product cards */}
      </div>

      <div className="divider"></div>

      <p className="text-[#AAAAAA] text-center">Description text</p>
      
      <button className="button-ghost">SEE MORE</button>
    </section>
  );
}
```

## Hover States

```tsx
/* Text hover */
className="text-white hover:text-[#C9A24A] transition-colors"

/* Background hover */
className="bg-[#111111] hover:bg-[#222222] transition-colors"

/* Image zoom hover */
className="hover:scale-105 transition-transform duration-300"

/* Shadow hover (gold glow) */
className="hover:shadow-lg hover:shadow-[#C9A24A]/20"
```

## Dark Mode Considerations

The entire site is dark mode by default. No light mode toggle needed.

All colors follow the luxury dark theme:
- Never use white backgrounds
- Navigation is dark with gold accents
- Hover states use gold color
- Text contrast meets WCAG AA standards

## Accessibility

```tsx
// Semantic HTML
<nav>...</nav>
<main>...</main>
<footer>...</footer>

// ARIA labels for icons
<button aria-label="Previous slide">
  <svg>...</svg>
</button>

// Form accessibility
<input placeholder="Enter your email" />
<button type="submit">Subscribe</button>
```

## Performance Tips

1. Use Next.js Image component for images
2. Lazy load components with dynamic imports
3. Leverage Tailwind's JIT for optimal CSS
4. Use CSS custom properties for theming
5. Minimize JavaScript on homepage load

---

**Last Updated**: 2026-04-04
**Version**: 1.0.0
