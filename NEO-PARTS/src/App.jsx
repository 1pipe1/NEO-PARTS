import { useState } from "react";
import { products } from "./mockdata/products";
import "./index.css";
import ProductCard from "./components/molecules/ProductCard";
import CartSummary from "./components/organisms/CartSummary";
import Navbar from "./components/organisms/Navbar";
import useCartStore from "./store/useCartStore";

const PRODUCTS_PER_PAGE = 6; // 👈 NUEVO

function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 👈 NUEVO
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // 👈 NUEVO — calcular productos de la página actual
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar search={search} onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }} />

      <div className="p-8">
        <CartSummary />

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No se encontraron productos 😕</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
          {paginatedProducts.map((product) => ( // 👈 paginatedProducts, no filteredProducts
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 👈 NUEVO — botones de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;