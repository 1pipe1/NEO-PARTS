import { products } from "./mockdata/products";
import "./index.css";
import ProductCard from "./components/molecules/ProductCard";
import useCartStore from "./store/useCartStore";
import CartSummary from "./components/organisms/CartSummary";

function App() {
  const cart = useCartStore((state) => state.cart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  return (
    <>
   
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nexo.io</h1>
      <p>Carrito: {getTotalItems()}</p>
      <div>
        <CartSummary/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className=" sticky bottom-0 left-0 right-0 bg-gray-800 p-4">
      </div>
    </div>
    </>
  ); 
}

export default App;
