import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

const HomePage = () => {
  return (
    <ProductList data={sampleData.products} title="Newest Arrival" limit={4} />
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
