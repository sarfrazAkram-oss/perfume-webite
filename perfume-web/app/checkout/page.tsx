import type { Metadata } from "next";
import CheckoutPage from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout - The Olfactory Gallery",
  description: "Clean Shopify-style checkout for fragrance orders.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawProductId = resolvedSearchParams.productId;
  const productIdValue = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;
  const parsedProductId = Number(productIdValue);

  return (
    <CheckoutPage
      initialProductId={Number.isFinite(parsedProductId) && parsedProductId > 0 ? parsedProductId : 1}
    />
  );
}