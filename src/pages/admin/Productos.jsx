import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    categoria: "",
    precio_venta: "",
    estado: "Activo",
  });

  // ✅ Cargar productos desde el backend
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getData("productos");
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast.error("❌ No se pudo obtener la lista de productos.");
    }
  };

  // ✅ Guardar o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nombre: nuevo.nombre,
        categoria: nuevo.categoria,
        precio_venta: parseFloat(nuevo.precio_venta) || 0,
        estado: nuevo.estado,
      };

      if (editando) {
        await updateData("productos", editando, dataToSend);
        toast.success("✅ Producto actualizado correctamente.");
      } else {
        await createData("productos", dataToSend);
        toast.success("✅ Producto creado correctamente.");
      }

      setModalOpen(false);
      setNuevo({ nombre: "", categoria: "", precio_venta: "", estado: "Activo" });
      setEditando(null);
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.error("❌ Error al guardar el producto.");
    }
  };

  // ✅ Editar
  const abrirModal = (p = null) => {
    if (p) {
      setEditando(p.id_producto);
      setNuevo({
        nombre: p.nombre,
        categoria: p.categoria,
        precio_venta: p.precio_venta,
        estado: p.estado || "Activo",
      });
    } else {
      setEditando(null);
      setNuevo({ nombre: "", categoria: "", precio_venta: "", estado: "Activo" });
    }
    setModalOpen(true);
  };

  // ✅ Eliminar
  const eliminar = async (id) => {
    if (confirm("¿Eliminar este producto?")) {
      try {
        await deleteData("productos", id);
        toast.success("🗑️ Producto eliminado correctamente.");
        cargarProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        toast.error("❌ No se pudo eliminar el producto.");
      }
    }
  };

  return (
    <div className="p-8 bg-[#F7F8FA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#B71C1C]">Productos</h1>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* ✅ Tabla de productos */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F2C3E] text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Categoría</th>
              <th className="p-4 text-center">Precio Venta (S/)</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={p.id_producto} className="border-b hover:bg-gray-100 transition-all">
                <td className="p-4">{i + 1}</td>
                <td className="p-4 font-semibold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-[#B71C1C]" />
                  {p.nombre}
                </td>
                <td className="p-4">{p.categoria}</td>
                <td className="p-4 text-center">S/ {Number(p.precio_venta || 0).toFixed(2)}</td>
                <td
                  className={`p-4 text-center font-semibold ${
                    p.estado === "Activo" ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {p.estado || "Activo"}
                </td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => abrirModal(p)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => eliminar(p.id_producto)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#0F2C3E] mb-4">
              {editando ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nuevo.nombre}
                  onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  value={nuevo.categoria}
                  onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Precio Venta (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevo.precio_venta}
                  onChange={(e) => setNuevo({ ...nuevo, precio_venta: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Estado</label>
                <select
                  value={nuevo.estado}
                  onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#B71C1C] text-white font-semibold hover:bg-[#8B0000]"
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

export default Productos;
