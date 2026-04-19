import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/products";

export default function WomenPage() {
  return (
    <CategoryPage
      title="WOMEN"
      products={getProductsByCategory("Women")}
    />
  );
}
