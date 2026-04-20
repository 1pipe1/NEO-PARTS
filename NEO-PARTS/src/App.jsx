import { products } from "./mockdata/products";
import "./index.css";
import { useState } from "react";
import ProductCard from "./components/molecules/ProductCard";
import CartSummary from "./components/organisms/CartSummary";
import Navbar from "./components/organisms/Navbar";
import useCartStore from "./store/useCartStore";

function App() {
  const [search, setSearch] = useState("");
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar con buscador y carrito */}
      <Navbar search={search} onSearchChange={setSearch} />

      <div className="p-8">
        <CartSummary />

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No se encontraron productos 😕
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
