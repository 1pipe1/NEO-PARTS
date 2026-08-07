import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

type ApiProduct = {
  id: number | string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

const seedProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = (await response.json()) as ApiProduct[];

    for (const product of products) {
      await setDoc(doc(db, "products", String(product.id)), {
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
        stock: 10,
      });
      console.log(`✅ Subido: ${product.title}`);
    }

    console.log("🎉 Todos los productos subidos!");
  } catch (error) {
    console.error("Error:", error);
  }
};

// seedProducts();