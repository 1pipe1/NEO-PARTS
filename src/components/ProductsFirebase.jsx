import { useEffect } from "react";
import useStockStore from "../store/useStockStore";
import ProductCard from "./molecules/ProductCard";


function ProductsFirebase() {
  const { products, fetchProducts } = useStockStore();

  useEffect(() => {
    console.log("ProductsFirebase mounted");
    fetchProducts();
  }, []);

  return products.map((p) => <ProductCard key={p.id} product={p} />);
}

export default ProductsFirebase;
