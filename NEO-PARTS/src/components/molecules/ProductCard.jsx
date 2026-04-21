import Button from "../atoms/Button";
import Price from "../atoms/Price";
import useCartStore from "../../store/useCartStore";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-semibold mb-3 text-white">{product.name}</h2>
      <p className="text-sm text-gray-400 mb-2">{product.category}</p>
      <Price amount={product.price} />
      <Button text="Agregar al carrito" onClick={() => addToCart(product)} />
    </div>
  );
};

export default ProductCard;
