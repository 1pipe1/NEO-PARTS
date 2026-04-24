import Button from "../atoms/Button";
import Price from "../atoms/Price";
import useCartStore from "../../store/useCartStore";
import { useState } from "react";
const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col text-center">
      <div className="h-48 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold mb-3 text-white h-12 line-clamp-2">
        {product.title}
      </h2>
      <p className="text-sm text-gray-400 mb-2">{product.category}</p>
      <Price amount={product.price} />
      <Button
        text="Agregar al carrito"
        onClick={() => addToCart({ ...product, quantity })}
        className="mt-auto"
      />
    </div>
  );
};

export default ProductCard;
