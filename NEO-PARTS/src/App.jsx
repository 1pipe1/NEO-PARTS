import { useState } from "react";
import { products } from "./mockdata/products";
import "./index.css";
import ProductCard from "./components/molecules/ProductCard";
import CartSummary from "./components/organisms/CartSummary";
import Navbar from "./components/organisms/Navbar";
import useCartStore from "./store/useCartStore";
import AuthPage from "./pages/AuthPage";
import useAuthStore from "./store/useAuthStore";

const PRODUCTS_PER_PAGE = 6;

function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
      />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Bienvenido,{" "}
            <span className="text-orange-500">{user?.name || "Usuario"}</span>
          </h2>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <CartSummary />

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No se encontraron productos 😕
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
