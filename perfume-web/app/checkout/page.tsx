import type { Metadata } from "next";
import CheckoutPage from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout - The Olfactory Gallery",
  description: "Clean Shopify-style checkout for fragrance orders.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string | string[]; quantity?: string | string[]; size?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawProductId = resolvedSearchParams.productId;
  const rawQuantity = resolvedSearchParams.quantity;
  const rawSize = resolvedSearchParams.size;
  const productKeyValue = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;
  const quantityValue = Array.isArray(rawQuantity) ? rawQuantity[0] : rawQuantity;
  const sizeValue = Array.isArray(rawSize) ? rawSize[0] : rawSize;
  const parsedQuantity = Number(quantityValue);
  const parsedProductId = Number(productKeyValue);

  return (
    <CheckoutPage
      initialProductKey={typeof productKeyValue === "string" ? productKeyValue : undefined}
      initialProductId={Number.isFinite(parsedProductId) && parsedProductId > 0 ? parsedProductId : undefined}
      initialQuantity={Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1}
      initialSize={typeof sizeValue === "string" ? sizeValue : undefined}
    />
  );
}