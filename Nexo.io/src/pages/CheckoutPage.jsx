import { useState } from 'react';
import useCartStore from '../store/useCartStore';

// Página de checkout para previsualizar y confirmar la compra
const CheckoutPage = () => {
  // Estado para mostrar mensaje de compra exitosa
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Obtener funciones y datos del store del carrito
  const cart = useCartStore((state) => state.cart); // Productos en el carrito
  const getTotalPrice = useCartStore((state) => state.getTotalPrice); // Función para calcular total
  const clearCart = useCartStore((state) => state.clearCart); // Función para vaciar el carrito

  // Calcular el precio total de la compra
  const totalPrice = getTotalPrice();

  // Función para manejar la confirmación de la compra
  const handleConfirmPurchase = () => {
    // Vaciar el carrito
    clearCart();
    // Mostrar mensaje de éxito
    setPurchaseSuccess(true);
  };

  // Si la compra fue exitosa, mostrar mensaje de confirmación
  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center max-w-md">
          {/* Icono de check verde */}
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-500 mb-4">
            ¡Compra Exitosa!
          </h2>
          <p className="text-gray-300 mb-6">
            Tu pedido ha sido procesado correctamente.
          </p>
          {/* Botón para volver al inicio (recargar página) */}
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío, mostrar mensaje
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-400 mb-4">
            Carrito Vacío
          </h2>
          <p className="text-gray-300 mb-6">
            No tienes productos en tu carrito.
          </p>
          {/* Botón para volver al inicio */}
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Mostrar el resumen del carrito con productos y total
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Título de la página */}
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
          Resumen de Compra
        </h1>

        {/* Contenedor principal del checkout */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          {/* Lista de productos en el carrito */}
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              // Card individual para cada producto
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                {/* Información del producto */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-400 text-sm">
                    Cantidad: {item.quantity}
                  </p>
                </div>

                {/* Precio del producto (precio unitario * cantidad) */}
                <div className="text-right">
                  <p className="font-bold text-orange-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-600 my-6"></div>

          {/* Total de la compra */}
          <div className="flex justify-between items-center text-2xl font-bold mb-6">
            <span>Total:</span>
            <span className="text-orange-500">${totalPrice.toFixed(2)}</span>
          </div>

          {/* Botón para confirmar la compra */}
          <button
            onClick={handleConfirmPurchase}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors text-lg"
          >
            Confirmar Compra
          </button>

          {/* Botón para cancelar y volver */}
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
