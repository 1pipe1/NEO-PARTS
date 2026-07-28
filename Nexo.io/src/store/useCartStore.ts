import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type Product = {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
  quantity?: number;
};

type CartItem = Product & {
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  activeDraftId: string | null;
  setActiveDraftId: (draftId: string) => void;
  clearActiveDraftId: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCart: (newCart: CartItem[]) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      activeDraftId: null,

      setActiveDraftId: (draftId: string) => set({ activeDraftId: draftId }),
      clearActiveDraftId: () => set({ activeDraftId: null }),

      addToCart: (product: Product) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) => String(item.id) === String(product.id),
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              String(item.id) === String(product.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId: string) => {
        set({
          cart: get().cart.filter(
            (item) => String(item.id) !== String(productId),
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      setCart: (newCart: CartItem[]) => set({ cart: newCart }),

      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCartStore;
