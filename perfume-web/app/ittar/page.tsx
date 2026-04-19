import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/products";

export default function IttarPage() {
  return (
    <CategoryPage
      title="ITTAR COLLECTION"
      products={getProductsByCategory("Attar")}
    />
  );
}