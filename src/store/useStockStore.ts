import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

type Product = {
  id: string;
  name?: string;
  title?: string;
  price?: number;
  stock: number;
  category?: string;
  image?: string;
};

type SoldItem = {
  id: string;
  quantity: number;
};

type StockState = {
  products: Product[];
  fetchProducts: () => Promise<void>;
  updateStock: (soldItems: SoldItem[]) => Promise<void>;
  addStock: (newProducts: Product[]) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
  hasStock: (productId: string, quantity?: number) => boolean;
  getLowStockProducts: (threshold?: number) => Product[];
};

const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      products: [],

      fetchProducts: async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const products: Product[] = querySnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<Product, "id">),
          }));
          set({ products });
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },

      updateStock: async (soldItems: SoldItem[]) => {
        try {
          const currentProducts = get().products;
          const updatedProducts = currentProducts.map((product) => {
            const soldItem = soldItems.find(
              (item) => String(item.id) === String(product.id),
            );

            if (soldItem) {
              const newStock = product.stock - soldItem.quantity;
              return {
                ...product,
                stock: Math.max(0, newStock),
              };
            }

            return product;
          });

          set({ products: updatedProducts });

          for (const item of soldItems) {
            const productRef = doc(db, "products", String(item.id));
            const product = updatedProducts.find(
              (p) => String(p.id) === String(item.id),
            );

            if (product) {
              await updateDoc(productRef, { stock: product.stock });
            }
          }
        } catch (error) {
          console.error("Error updating stock:", error);
        }
      },

      addStock: async (newProducts: Product[]) => {
        try {
          const currentProducts = get().products;
          const updatedProducts = [...currentProducts];

          for (const newProduct of newProducts) {
            const existingIndex = updatedProducts.findIndex(
              (p) => String(p.id) === String(newProduct.id),
            );

            if (existingIndex >= 0) {
              updatedProducts[existingIndex] = {
                ...updatedProducts[existingIndex],
                stock: updatedProducts[existingIndex].stock + newProduct.stock,
              };
            } else {
              updatedProducts.push(newProduct);
            }
          }

          set({ products: updatedProducts });

          for (const newProduct of newProducts) {
            const productRef = doc(db, "products", String(newProduct.id));
            const existingProduct = updatedProducts.find(
              (p) => String(p.id) === String(newProduct.id),
            );

            if (existingProduct) {
              await updateDoc(productRef, { stock: existingProduct.stock });
            }
          }
        } catch (error) {
          console.error("Error adding stock:", error);
        }
      },

      getProductById: (productId: string) => {
        return get().products.find(
          (product) => String(product.id) === String(productId),
        );
      },

      hasStock: (productId: string, quantity = 1) => {
        const product = get().getProductById(productId);
        return !!product && product.stock >= quantity;
      },

      getLowStockProducts: (threshold = 5) => {
        return get().products.filter((product) => product.stock <= threshold);
      },
    }),
    {
      name: "stock-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useStockStore;
