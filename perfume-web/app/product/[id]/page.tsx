import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";
import {
  getProductByKey,
  getRelatedProducts,
  getProductSlug,
  products,
} from "@/lib/products";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return products.flatMap((product) => [
    {
      id: product.id.toString(),
    },
    {
      id: getProductSlug(product),
    },
  ]);
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductByKey(id);

  if (!product) {
    return {
      title: "Product unavailable | The Olfactory Gallery",
      description:
        "The requested product could not be found. Browse the full catalog to continue shopping.",
    };
  }

  return {
    title: `${product.name} | The Olfactory Gallery`,
    description: product.description,
  };
}

function ProductFallback({ productKey }: { productKey: string }) {
  return (
    <main className="min-h-screen bg-[#FBF6EF] px-4 py-24 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8A6F2D]">
          Product unavailable
        </p>
        <h1 className="text-3xl font-bold tracking-[0.08em] sm:text-4xl">
          We could not find this product.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
          The product link for <span className="font-semibold text-black">{productKey}</span> is not valid,
          but you can still browse the catalog or return to the home page.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gray-800"
          >
            Go Home
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-gray-300 bg-[#FBF6EF] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#F1E7D9]"
          >
            Search Products
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductByKey(id);

  if (!product) {
    return <ProductFallback productKey={id} />;
  }

  const relatedProducts = getRelatedProducts(product);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}