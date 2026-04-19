export type ProductCategory = "Men" | "Women" | "Arabic" | "Attar";

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: ProductCategory;
  description: string;
  sizes: string[];
}

function slugifyProductName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product: Product) {
  return slugifyProductName(product.name);
}

export function getProductHref(product: Product) {
  return `/product/${encodeURIComponent(getProductSlug(product))}`;
}

export function getProductByKey(productKey: string) {
  const normalizedKey = productKey.trim();

  if (!normalizedKey) {
    return undefined;
  }

  const numericId = Number(normalizedKey);

  if (Number.isInteger(numericId)) {
    const productById = getProductById(numericId);

    if (productById) {
      return productById;
    }
  }

  const normalizedSlug = slugifyProductName(normalizedKey);

  return products.find((product) => getProductSlug(product) === normalizedSlug);
}

export const products: Product[] = [
  {
    id: 1,
    name: "Midnight Cologne",
    price: 89.99,
    oldPrice: 120,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "A crisp masculine scent with smoky woods, clean musk, and a confident finish that lasts through day and night.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 2,
    name: "Royal Essence",
    price: 95,
    oldPrice: 150,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "Deep amber and subtle spice blended into a refined signature fragrance designed for modern elegance.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 3,
    name: "Urban Spirit",
    price: 75.99,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "Fresh citrus, cedar, and clean aromatic notes create an everyday fragrance with an energetic urban edge.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 4,
    name: "Classic Noir",
    price: 110,
    oldPrice: 160,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "A bold evening blend of leather, woods, and warm resin notes with a smooth, polished dry down.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 5,
    name: "Noir Legend",
    price: 118,
    oldPrice: 170,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "Rich oud and dark amber give this fragrance a commanding profile that feels luxurious and long lasting.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 6,
    name: "Atlas Drift",
    price: 102,
    image: "/images/products/men.svg",
    category: "Men",
    description:
      "A smooth blend of spice, woods, and light musk built for daily wear and easy layering.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 7,
    name: "Rose Elegance",
    price: 85,
    oldPrice: 130,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "Soft rose petals, vanilla cream, and a gentle floral trail make this a graceful all-day signature scent.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 8,
    name: "Floral Whisper",
    price: 92.99,
    oldPrice: 145,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "A bright bouquet with jasmine, pear, and soft musk that feels airy, polished, and feminine.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 9,
    name: "Amber Dream",
    price: 99.99,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "Warm amber, sweet florals, and a creamy base give this fragrance a cozy yet sophisticated finish.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 10,
    name: "Vanille Luxe",
    price: 105,
    oldPrice: 155,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "A luxurious vanilla fragrance lifted by soft florals and ambered warmth for an elegant evening feel.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 11,
    name: "Rose Silk",
    price: 111,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "Silky rose, delicate powdery notes, and a smooth musky base create a refined romantic perfume.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 12,
    name: "Velvet Iris",
    price: 121,
    oldPrice: 159,
    image: "/images/products/women.svg",
    category: "Women",
    description:
      "Iris, amber, and creamy sandalwood form a soft velvet-like trail that feels elegant and modern.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 13,
    name: "Oud Al Khaleej",
    price: 120,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "Traditional oud meets smoky woods and warm amber in a deep oriental fragrance with rich presence.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 14,
    name: "Musk Al Noor",
    price: 110,
    oldPrice: 160,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "A clean musk fragrance wrapped in soft incense and amber for a smooth, graceful Arabic profile.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 15,
    name: "Amber Al Reef",
    price: 125,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "Amber, spice, and golden woods create a warm and opulent scent inspired by classic Arabian perfumery.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 16,
    name: "Raqs Al Zahra",
    price: 115,
    oldPrice: 170,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "A floral oud composition with rose, saffron, and smoky depth that feels rich and ceremonial.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 17,
    name: "Sultan Oud",
    price: 132,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "Strong oud, incense, and dark amber deliver a regal fragrance built for special occasions.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 18,
    name: "Royal Musk",
    price: 138,
    oldPrice: 175,
    image: "/images/products/arabic.svg",
    category: "Arabic",
    description:
      "A polished blend of musk, amber, and soft wood notes that stays close to the skin with elegance.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 19,
    name: "Royal Attar",
    price: 145,
    oldPrice: 180,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "A luxurious attar with sandalwood, floral essence, and a smooth oil-based finish that lasts beautifully.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 20,
    name: "Noor Essence",
    price: 138,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "Soft floral oils and warm musk combine into a radiant attar with a clean, refined character.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 21,
    name: "Amber Sultan",
    price: 152,
    oldPrice: 185,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "Amber, spice, and woody depth give this attar a powerful and warm presence with a smooth trail.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 22,
    name: "Musk Dune",
    price: 129,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "A soft desert-inspired musk with dry woods and a gentle oil texture that feels understated and elegant.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 23,
    name: "Oud Heritage",
    price: 166,
    oldPrice: 199,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "Deep oud blended with rose, amber, and resin for a heritage-inspired attar with strong character.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
  {
    id: 24,
    name: "Desert Rose",
    price: 141,
    image: "/images/products/attar.svg",
    category: "Attar",
    description:
      "A luminous rose attar touched by spice and woods for a balanced fragrance with a soft dry down.",
    sizes: ["10 ML", "20 ML", "50 ML"],
  },
];

export const bestSellerIds = [1, 7, 13, 4, 8, 19, 10, 23];

export const bulkOrderIds = [1, 2, 6, 7, 11, 13, 17, 19];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function getProductsByIds(ids: number[]) {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id,
    )
    .slice(0, limit);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getDiscountPercent(product: Product) {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery),
  );
}