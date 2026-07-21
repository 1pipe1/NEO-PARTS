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
    <div
      className={
        "bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-xl w-full md:max-w-sm md:ml-auto"
      }
    >
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Mi Carrito</h2>

      {/* Lista de items con botón quitar */}
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm"
        >
          <div className="flex-1">
            <p className="text-[#0F172A] font-normal">{item.name}</p>
            <p className="text-[#0F172A] text-slate-500">
              Cantidad: {item.quantity} × ${item.price}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#EA580C] font-semibold">
              ${(item.price * item.quantity).toLocaleString("es-CO")}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-slate-400 hover:text-red-500 font-bold text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between text-[#0F172A] mb-2">
        <span>Productos:</span>
        <span>{getTotalItems()}</span>
      </div>

      <div className="flex justify-between text-2xl font-bold text-green-600">
        <span>Total:</span>
        <span>${total.toLocaleString("es-CO")}</span>
      </div>

      <button
        onClick={() => {
          handleCheckout();
          clearCart();
        }}
        style={{ backgroundColor: "#EA580C" }}
        className="w-full mt-6 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all"
      >
        Finalizar Compra
      </button>

      <button
        onClick={clearCart}
        className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold py-2 rounded-xl transition-all"
      >
        Vaciar Carrito
      </button>
    </div>
  );
};

export default CartSummary;
