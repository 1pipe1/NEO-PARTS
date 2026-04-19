import { products } from "./mockdata/products";
import "./index.css";
function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nexo.io</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">
              {product.name}
            </h2>
            <p className="text-sm text-gray-400 mb-2">{product.category}</p>
            <p className="text-2xl font-bold text-orange-400">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
