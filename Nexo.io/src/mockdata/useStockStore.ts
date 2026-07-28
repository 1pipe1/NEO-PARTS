import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types/product";

type StockState = {
  products: Product[];
  fetchProducts: () => Promise<void>;
  // aquí puedes añadir otras acciones relacionadas al stock si quieres
};

const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      products: [],
      fetchProducts: async () => {
        try {
          const snapshot = await getDocs(collection(db, "products"));
          const products = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Product[];

          set({ products });
        } catch (error) {
          console.error("Error fetching products from Firestore:", error);
        }
      },
    }),
    {
      name: "stock-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useStockStore;
