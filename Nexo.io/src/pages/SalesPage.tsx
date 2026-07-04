import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  total: number;
  userEmail: string;
  createdAt: any;
  status?: string;
  items?: OrderItem[];
}

const ORDERS_PER_PAGE = 10;

const SalesPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(data);
    });
    return () => unsub();
  }, []);

  const totalVentas = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const ordenesHoy = orders.filter((o) => {
    if (!o.createdAt) return false;
    return o.createdAt.toDate().toDateString() === new Date().toDateString();
  }).length;
  const promedio = orders.length ? totalVentas / orders.length : 0;

  const filtered = filterDate
    ? orders.filter((o) => {
        if (!o.createdAt) return false;
        const date = o.createdAt.toDate();
        // Formato local YYYY-MM-DD sin convertir a UTC
        const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        return localDate === filterDate;
      })
    : orders;

  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar esta orden?",
    );
    if (!confirmed) return;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "cancelled",
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error al cancelar la orden. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">💰 Ventas</h1>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total ventas</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            ${totalVentas.toFixed(0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Órdenes hoy</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            {ordenesHoy}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Promedio por orden</p>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            ${promedio.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Órdenes recientes</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setCurrentPage(1);
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">ID</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    {filterDate
                      ? "No hay órdenes en esa fecha"
                      : "No hay órdenes aún"}
                  </td>
                </tr>
              ) : (
                paginated.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 text-xs text-gray-400">
                      {o.id.slice(0, 8)}...
                    </td>
                    <td className="py-3">{o.userEmail || "—"}</td>
                    <td className="py-3 font-semibold text-green-600">
                      ${o.total?.toFixed(0)}
                    </td>
                    <td className="py-3">
                      {o.status === "cancelled" ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          ❌ Cancelada
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          ✅ Completada
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                        >
                          Ver detalle →
                        </button>
                        {o.status === "completed" && (
                          <button
                            onClick={() => handleCancelOrder(o.id)}
                            className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-xs text-gray-400">
              Mostrando {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
              {Math.min(currentPage * ORDERS_PER_PAGE, filtered.length)} de{" "}
              {filtered.length} órdenes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalle orden */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="p-5 border-b flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Detalle de orden</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  #{selectedOrder.id.slice(0, 8)}...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(selectedOrder as any).customerName ||
                    selectedOrder.userEmail ||
                    "—"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.createdAt.toDate().toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Vendido por: {(selectedOrder as any).soldBy || "—"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="p-5 flex flex-col gap-3">
              {selectedOrder.items?.length ? (
                selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-lg border border-gray-100"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.name || "Producto"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × ${item.price?.toFixed(0)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      ${(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No hay items registrados
                </p>
              )}
            </div>

            {/* Footer total */}
            <div className="p-5 border-t flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-green-600">
                ${selectedOrder.total?.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
