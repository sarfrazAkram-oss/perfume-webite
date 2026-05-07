import { redirect } from "next/navigation";
import { getCheckoutHref, getProductByKey } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductByKey(id);

  if (!product) {
    redirect("/search");
  }

  redirect(getCheckoutHref(product));
}