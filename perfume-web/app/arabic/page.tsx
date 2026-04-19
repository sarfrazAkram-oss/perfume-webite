import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/products";

export default function ArabicPage() {
  return (
    <CategoryPage
      title="ARABIC"
      products={getProductsByCategory("Arabic")}
    />
  );
}
