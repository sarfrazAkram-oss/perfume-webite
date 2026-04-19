import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/products";

export default function MenPage() {
  return (
    <CategoryPage
      title="MEN"
      products={getProductsByCategory("Men")}
    />
  );
}
