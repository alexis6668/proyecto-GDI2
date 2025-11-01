import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";

function Compras() {
  const [compras, setCompras] = useState([]);
  const [form, setForm] = useState({
    id_proveedor: "",
    fecha_compra: new Date().toISOString().split("T")[0],
    total: "",
    estado: "Recibido",
  });
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  // 🔹 Cargar compras y proveedores
  useEffect(() => {
    cargarCompras();
    cargarProveedores();
  }, []);

  const cargarCompras = async () => {
    try {
      const data = await getData("compras");
      setCompras(data);
    } catch (error) {
      console.error("Error al cargar compras:", error);
      toast.error("❌ No se pudieron cargar las compras.");
    }
  };

  const cargarProveedores = async () => {
    try {
      const data = await getData("proveedores");
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      toast.error("❌ No se pudieron cargar los proveedores.");
    }
  };

  // 🔹 Guardar o actualizar compra
  const guardarCompra = async (e) => {
    e.preventDefault();

    if (!form.id_proveedor || !form.total) {
      toast.error("⚠️ Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (editando) {
        await updateData("compras", idEditar, form);
        toast.success("✅ Compra actualizada correctamente.");
      } else {
        await createData("compras", form);
        toast.success("✅ Compra registrada correctamente.");
      }

      setMostrarModal(false);
      setEditando(false);
      setIdEditar(null);
      setForm({
        id_proveedor: "",
        fecha_compra: new Date().toISOString().split("T")[0],
        total: "",
        estado: "Recibido",
      });
      cargarCompras();
    } catch (error) {
      console.error("Error al guardar compra:", error);
      toast.error("❌ Error al guardar la compra.");
    }
  };

  // 🔹 Editar compra
  const editarCompra = (c) => {
    setForm({
      id_proveedor: c.id_proveedor,
      fecha_compra: c.fecha_compra.split("T")[0],
      total: c.total,
      estado: c.estado,
    });
    setEditando(true);
    setIdEditar(c.id_compra);
    setMostrarModal(true);
  };

  // 🔹 Eliminar compra
  const eliminarCompra = async (id) => {
    if (window.confirm("¿Deseas eliminar esta compra?")) {
      try {
        await deleteData("compras", id);
        toast.success("🗑️ Compra eliminada correctamente.");
        cargarCompras();
      } catch (error) {
        console.error("Error al eliminar compra:", error);
        toast.error("❌ No se pudo eliminar la compra.");
      }
    }
  };

  // 🔹 Filtrado por búsqueda
  const filtradas = compras.filter(
    (c) =>
      c.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.fecha_compra?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Totales
  const totalGeneral = compras.reduce((sum, c) => sum + Number(c.total || 0), 0);

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Compras</h1>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p className="text-sm">Compras Totales</p>
          <h2 className="text-3xl font-bold">{compras.length}</h2>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <p className="text-sm">Total General (S/)</p>
          <h2 className="text-3xl font-bold">{totalGeneral.toFixed(2)}</h2>
        </div>
        <div className="bg-green-700 text-white p-4 rounded-lg">
          <p className="text-sm">Última Compra</p>
          <h2 className="text-2xl font-semibold">
            {compras[0]?.fecha_compra?.split("T")[0] || "—"}
          </h2>
        </div>
      </div>

      {/* Barra búsqueda */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por proveedor o fecha..."
          className="border p-2 rounded w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center hover:bg-yellow-600 transition"
          onClick={() => {
            setEditando(false);
            setForm({
              id_proveedor: "",
              fecha_compra: new Date().toISOString().split("T")[0],
              total: "",
              estado: "Recibido",
            });
            setMostrarModal(true);
          }}
        >
          <FaPlus className="mr-2" /> Nueva Compra
        </button>
      </div>

      {/* Tabla */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Proveedor</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Total (S/)</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((c, i) => (
            <tr key={c.id_compra} className="text-center hover:bg-gray-50">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{c.proveedor || "—"}</td>
              <td className="p-2 border">
                {c.fecha_compra?.split("T")[0] || "—"}
              </td>
              <td className="p-2 border font-semibold">{c.total}</td>
              <td
                className={`p-2 border font-semibold ${
                  c.estado === "Recibido" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {c.estado}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => editarCompra(c)}
                  className="text-blue-600 mx-1 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => eliminarCompra(c.id_compra)}
                  className="text-red-600 mx-1 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-[700px] rounded-2xl shadow-xl p-6 relative border border-gray-200">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <FaShoppingCart />
              {editando ? "Editar Compra" : "Registrar Nueva Compra"}
            </h2>

            <form onSubmit={guardarCompra}>
              <div className="grid grid-cols-2 gap-4">
                {/* Proveedor */}
                <select
                  name="id_proveedor"
                  className="p-2 border rounded"
                  value={form.id_proveedor}
                  onChange={(e) =>
                    setForm({ ...form, id_proveedor: e.target.value })
                  }
                  required
                >
                  <option value="">-- Selecciona un proveedor --</option>
                  {proveedores.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                {/* Fecha */}
                <input
                  type="date"
                  name="fecha_compra"
                  className="p-2 border rounded"
                  value={form.fecha_compra}
                  onChange={(e) =>
                    setForm({ ...form, fecha_compra: e.target.value })
                  }
                  required
                />

                {/* Total */}
                <input
                  type="number"
                  step="0.01"
                  name="total"
                  placeholder="Total (S/)"
                  className="p-2 border rounded"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  required
                />

                {/* Estado */}
                <select
                  name="estado"
                  className="p-2 border rounded"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="Recibido">Recibido</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compras;
