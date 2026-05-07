import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string | string[]; quantity?: string | string[]; size?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawProductId = resolvedSearchParams.productId;
  const rawQuantity = resolvedSearchParams.quantity;
  const rawSize = resolvedSearchParams.size;
  const productIdValue = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;
  const quantityValue = Array.isArray(rawQuantity) ? rawQuantity[0] : rawQuantity;
  const sizeValue = Array.isArray(rawSize) ? rawSize[0] : rawSize;
  const query = new URLSearchParams();

  if (typeof productIdValue === "string" && productIdValue.trim()) {
    query.set("productId", productIdValue.trim());
  }

  if (typeof quantityValue === "string" && quantityValue.trim()) {
    query.set("quantity", quantityValue.trim());
  }

  if (typeof sizeValue === "string" && sizeValue.trim()) {
    query.set("size", sizeValue.trim());
  }

  redirect(query.toString() ? `/checkout?${query.toString()}` : "/checkout");
}