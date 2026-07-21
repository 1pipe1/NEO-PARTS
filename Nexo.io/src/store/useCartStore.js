import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      activeDraftId: null,

      setActiveDraftId: (draftId) => set({ activeDraftId: draftId }),
      clearActiveDraftId: () => set({ activeDraftId: null }),

      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) => String(item.id) === String(product.id)
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              String(item.id) === String(product.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter(
            (item) => String(item.id) !== String(productId)
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      setCart: (newCart) => set({ cart: newCart }),

      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
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
    }
  )
);

export default useCartStore;