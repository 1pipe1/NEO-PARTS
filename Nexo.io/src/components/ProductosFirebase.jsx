import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function ProductosFirebase() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(db, "producto"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Si no hay productos, crear datos de ejemplo
      if (lista.length === 0) {
        await createSampleData();
        // Volver a obtener los productos después de crearlos
        const newSnapshot = await getDocs(collection(db, "producto"));
        const newLista = newSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(newLista);
      } else {
        setProductos(lista);
      }
    };

    // Función para crear datos de ejemplo
    const createSampleData = async () => {
      const sampleProducts = [
        { nombre: "Arroz Diana 1kg", precio: 3500, categoria: "Despensa" },
        { nombre: "Aceite Vegetal 1L", precio: 8500, categoria: "Despensa" },
        {
          nombre: "Huevos Docena",
          precio: 12000,
          categoria: "Lácteos y Huevos",
        },
        {
          nombre: "Leche Entera 1L",
          precio: 4500,
          categoria: "Lácteos y Huevos",
        },
        { nombre: "Pan Blanco 500g", precio: 3800, categoria: "Panadería" },
      ];

      for (const product of sampleProducts) {
        await addDoc(collection(db, "producto"), product);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h2>Productos desde Firebase</h2>
      {productos.map((p) => (
        <div key={p.id}>
          <h3>{p.nombre}</h3>
          <p>${p.precio}</p>
          <p>{p.categoria}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductosFirebase;
