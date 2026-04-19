import CategoryPage from "@/components/CategoryPage";
import { bulkOrderIds, getProductsByIds } from "@/lib/products";

export default function BulkOrderPage() {
  return (
    <CategoryPage
      title="BULK ORDER"
      products={getProductsByIds(bulkOrderIds)}
    />
  );
}