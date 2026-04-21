import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store de Zustand para manejar el carrito de compras
// Usa persist para guardar el carrito en localStorage
const useCartStore = create(
  persist(
    (set, get) => ({
      // Estado inicial: carrito vacío
      cart: [],

      // Función para agregar producto al carrito
      addToCart: (product) => {
        const cart = get().cart;
        // Buscar si el producto ya existe en el carrito (comparando IDs como strings)
        const existingItem = cart.find(
          (item) => String(item.id) === String(product.id),
        );

        if (existingItem) {
          // Si ya existe, incrementar cantidad
          set({
            cart: cart.map((item) =>
              String(item.id) === String(product.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          // Si no existe, agregar nuevo producto con cantidad 1
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      // Función para eliminar producto del carrito
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      // Función para vaciar el carrito
      clearCart: () => set({ cart: [] }),

      // Función para obtener total de items en el carrito
      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      // Función para obtener precio total del carrito
      getTotalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      // Configuración de persistencia en localStorage
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useCartStore;
