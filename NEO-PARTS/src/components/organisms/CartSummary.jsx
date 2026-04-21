import useCartStore from "../../store/useCartStore";

// Componente CartSummary con prop para navegar al checkout
const CartSummary = ({ onCheckout }) => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Función para manejar el clic en "Finalizar Compra"
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl max-w-sm ml-auto">
      <h2 className="text-xl font-bold text-orange-500 mb-4">
        Resumen de Venta
      </h2>

      {/* Lista de items con botón quitar */}
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-2 text-sm text-gray-300"
        >
          <span>
            {item.name} × {item.quantity}
          </span>
          <div className="flex items-center gap-2">
            <span>${(item.price * item.quantity).toLocaleString("es-CO")}</span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between text-gray-300 mb-2">
        <span>Productos:</span>
        <span>{getTotalItems()}</span>
      </div>

      <div className="flex justify-between text-2xl font-bold text-green-400">
        <span>Total:</span>
        <span>${total.toLocaleString("es-CO")}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all"
      >
        Finalizar Compra
      </button>
    </div>
  );
};

export default CartSummary;
