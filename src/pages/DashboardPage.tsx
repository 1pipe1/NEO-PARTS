import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import useStockStore from "../store/useStockStore";
type Order = {
  id: string;
  total?: number;
  createdAt?: { toDate: () => Date };
  // puedes añadir más campos si los usas luego
};

const DashboardPage = () => {
  const products = useStockStore((state) => state.products);
  const fetchProducts = useStockStore((state) => state.fetchProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      const snapshot = await getDocs(collection(db, "orders"));
      const data: Order[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];
      setOrders(data);
      setLoading(false);
    };
    loadData();
  }, [fetchProducts]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProducts = products.length;
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );
  const categories = [...new Set(products.map((p) => p.category))].length;

  const metrics = [
    {
      label: "Historico Ventas",
      value: orders.length,
      icon: "🧾",
      color: "bg-blue-500",
    },
    {
      label: "Ingresos Totales",
      value: `$${totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      icon: "💰",
      color: "bg-green-500",
    },
    {
      label: "Productos",
      value: totalProducts,
      icon: "📦",
      color: "bg-orange-500",
    },
    {
      label: "Valor Inventario",
      value: `$${inventoryValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      icon: "🏪",
      color: "bg-purple-500",
    },
    {
      label: "Categorías",
      value: categories,
      icon: "🏷️",
      color: "bg-pink-500",
    },
    {
      label: "Órdenes Hoy",
      value: orders.filter((o) => {
        if (!o.createdAt) return false;
        const date = o.createdAt.toDate();
        return date.toDateString() === new Date().toDateString();
      }).length,
      icon: "📅",
      color: "bg-yellow-500",
    },
  ];

  if (loading)
    return <p className="p-8 text-gray-500">Cargando dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">📊 Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
          >
            <div
              className={`${m.color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center`}
            >
              {m.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{m.label}</p>
              <p className="text-2xl font-bold text-gray-800">{m.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
