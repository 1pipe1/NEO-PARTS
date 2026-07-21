import Button from "../atoms/Button";
import Price from "../atoms/Price";
import useCartStore from "../../store/useCartStore";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock === 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col text-center">
      <div className="h-48 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <h2 className="text-lg font-bold mb-3 text-[#0F172A] h-13 line-clamp-3">
        {product.title}
      </h2>
      <p className="text-sm text-gray-600 mb-4">{product.category}</p>
      <Price amount={product.price} />

      {/* Badge de stock 👇 */}
      {outOfStock ? (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-3">
          🚫 Agotado
        </span>
      ) : product.stock <= 10 ? (
        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full mb-3">
          ⚠️ Últimas {product.stock} unidades
        </span>
      ) : null}

      {/* Selector de cantidad — deshabilitado si agotado */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={outOfStock}
          className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-40"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={outOfStock}
          className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-40"
        >
          +
        </button>
      </div>

      <Button
        text={outOfStock ? "Sin stock" : "Agregar al carrito"}
        onClick={() => !outOfStock && addToCart({ ...product, quantity })}
        disabled={outOfStock}
        className={`mt-auto ${outOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
  );
};

export default ProductCard;
