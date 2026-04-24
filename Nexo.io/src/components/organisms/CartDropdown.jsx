import useCartStore from "../../store/useCartStore";

// Componente de carrito desplegable que aparece al hacer clic en el ícono del carrito
const CartDropdown = ({ isOpen, onClose, onCheckout }) => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Si el carrito está cerrado, no renderizar nada
  if (!isOpen) return null;

  return (
    // Overlay oscuro de fondo
    <div className="fixed inset-0 z-50">
      {/* Fondo oscuro que cierra el carrito al hacer clic */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel del carrito que aparece desde la derecha */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-800 shadow-xl overflow-y-auto">
        {/* Header del carrito */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-500">
            Mi Carrito ({getTotalItems()})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="p-4">
          {cart.length === 0 ? (
            // Mensaje cuando el carrito está vacío
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-400">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Lista de productos en el carrito */}
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        Cantidad: {item.quantity} × ${item.price}
                      </p>
                      <p className="text-orange-400 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 ml-3"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumen del total */}
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-lg font-bold text-green-400 mb-4">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Botones de acción */}
                <button
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mb-2"
                >
                  Finalizar Compra
                </button>

                <button
                  onClick={clearCart}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
