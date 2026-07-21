import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import useCartStore from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const SuspendedSalesPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setCart = useCartStore((state) => state.setCart);
  const setActiveDraftId = useCartStore((state) => state.setActiveDraftId);

  useEffect(() => {
    const q = query(
      collection(db, "draftOrders"),
      where("status", "==", "suspended"),
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDrafts(items);
      },
      (err) => console.error("Error listening draftOrders:", err),
    );

    return () => unsub();
  }, []);

  const handleResume = (draft) => {
    if (!draft?.items) return;
    // Map items to cart format (ensure quantity exists)
    const cartItems = draft.items.map((it) => ({
      id: it.id,
      title: it.title || it.name,
      price: it.price || 0,
      image: it.image || "",
      quantity: it.quantity || 1,
    }));

    setCart(cartItems);
    setActiveDraftId(draft.id);
    // Navigate back to the main products page so the cart is preserved and more products can be added
    navigate("/");
  };

  const handleCancel = async (draftId) => {
    const confirm = window.confirm(
      "¿Estás seguro? Esto cancelará la orden suspendida.",
    );
    if (!confirm) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "draftOrders", draftId));
    } catch (e) {
      console.error("Error deleting draft:", e);
      alert("No se pudo cancelar la orden. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">⏸️ Ventas suspendidas</h1>
      <p className="text-gray-600 mt-2 mb-6">
        A continuación se muestran las ventas pausadas. Podés reanudar la venta
        o cancelarla.
      </p>

      {drafts.length === 0 ? (
        <div className="text-gray-500">
          No hay ventas suspendidas por el momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => {
            const createdAt =
              draft.createdAt && draft.createdAt.toDate
                ? draft.createdAt.toDate()
                : draft.createdAt
                  ? new Date(draft.createdAt)
                  : null;
            return (
              <div key={draft.id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500">Creada por</div>
                    <div className="font-semibold">
                      {draft.createdBy || "Usuario"}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {createdAt ? createdAt.toLocaleString() : "-"}
                  </div>
                </div>

                <div className="space-y-2 mb-4 max-h-40 overflow-auto">
                  {draft.items && draft.items.length > 0 ? (
                    draft.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                      >
                        <img
                          src={item.image || ""}
                          alt={item.title || item.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {item.title || item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            cantidad: {item.quantity || 1}
                          </div>
                        </div>
                        <div className="text-right font-bold text-orange-500">
                          $
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Sin items</div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleResume(draft)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                    >
                      Continuar venta
                    </button>

                    <button
                      onClick={() => handleCancel(draft.id)}
                      disabled={loading}
                      className="px-1.5 py-0.8 bg-red-600 hover:bg-red-400 text-white rounded-xl font-semibold"
                    >
                      {loading ? "Cancelando..." : "Cancelar orden"}
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-orange-500">
                      ${(draft.total || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuspendedSalesPage;
