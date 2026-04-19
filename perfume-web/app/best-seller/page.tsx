import CategoryPage from "@/components/CategoryPage";
import { getProductsByIds, bestSellerIds } from "@/lib/products";

export default function BestSellerPage() {
  return (
    <CategoryPage
      title="BEST SELLER"
      products={getProductsByIds(bestSellerIds)}
    />
  );
}