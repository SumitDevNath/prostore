import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrival" limit={4} />
    </>
  );
};

export default HomePage;

/**
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  await delay(200);
  return <h1>ProStore</h1>;
};

export default HomePage;
 */
