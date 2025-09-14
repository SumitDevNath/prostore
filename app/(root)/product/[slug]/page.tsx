import { getProductsbySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductsbySlug(slug);
  if (!product) {
    notFound();
  }

  return <>{product.name}</>;
};

export default ProductDetailsPage;
