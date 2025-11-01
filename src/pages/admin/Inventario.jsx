import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";

function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]); // 🔹 productos disponibles
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nuevoItem, setNuevoItem] = useState({
    id_producto: "",
    cantidad_inicial: "",
    entradas: "",
    salidas: "",
  });

  // 🔹 Cargar inventario y productos al inicio
  useEffect(() => {
    cargarInventario();
    cargarProductos();
  }, []);

  const cargarInventario = async () => {
    try {
      const data = await getData("inventario");
      setInventario(data);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      toast.error("❌ No se pudo obtener el inventario.");
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await getData("productos");
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast.error("❌ No se pudieron cargar los productos.");
    }
  };

  // 🔹 Guardar o actualizar
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nuevoItem.id_producto) {
      toast.error("⚠️ Debes seleccionar un producto.");
      return;
    }

    try {
      const dataToSend = {
        ...nuevoItem,
        id_producto: Number(nuevoItem.id_producto),
        cantidad_inicial: Number(nuevoItem.cantidad_inicial) || 0,
        entradas: Number(nuevoItem.entradas) || 0,
        salidas: Number(nuevoItem.salidas) || 0,
      };

      if (editando) {
        await updateData("inventario", editando, dataToSend);
        toast.success("✅ Inventario actualizado correctamente.");
        setEditando(null);
      } else {
        await createData("inventario", dataToSend);
        toast.success("✅ Producto añadido al inventario.");
      }

      setModalOpen(false);
      setNuevoItem({
        id_producto: "",
        cantidad_inicial: "",
        entradas: "",
        salidas: "",
      });
      cargarInventario();
    } catch (error) {
      console.error("Error al guardar inventario:", error);
      toast.error("❌ Error al guardar los datos.");
    }
  };

  // 🔹 Editar
  const handleEditar = (item) => {
    setNuevoItem({
      id_producto: item.id_producto,
      cantidad_inicial: item.cantidad_inicial,
      entradas: item.entradas,
      salidas: item.salidas,
    });
    setEditando(item.id_inventario);
    setModalOpen(true);
  };

  // 🔹 Eliminar
  const handleEliminar = async (id) => {
    if (confirm("¿Deseas eliminar este registro de inventario?")) {
      try {
        await deleteData("inventario", id);
        toast.success("🗑️ Registro eliminado.");
        cargarInventario();
      } catch (error) {
        console.error("Error eliminando inventario:", error);
        toast.error("❌ No se pudo eliminar.");
      }
    }
  };

  return (
    <div className="p-8 bg-[#F7F8FA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#B71C1C]">Inventario</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F2C3E] text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Producto</th>
              <th className="p-4 text-center">Cantidad Inicial</th>
              <th className="p-4 text-center">Entradas</th>
              <th className="p-4 text-center">Salidas</th>
              <th className="p-4 text-center">Stock Actual</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item, i) => (
              <tr key={item.id_inventario} className="border-b hover:bg-gray-100">
                <td className="p-4">{i + 1}</td>
                <td className="p-4 font-semibold">{item.nombre_producto}</td>
                <td className="p-4 text-center">{item.cantidad_inicial}</td>
                <td className="p-4 text-center">{item.entradas}</td>
                <td className="p-4 text-center">{item.salidas}</td>
                <td className="p-4 text-center">{item.stock_actual}</td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEditar(item)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(item.id_inventario)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-2xl font-bold text-[#0F2C3E] mb-4">
              {editando ? "Editar Registro" : "Agregar al Inventario"}
            </h2>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Producto
                </label>
<select
  value={nuevoItem.id_producto}
  onChange={(e) =>
    setNuevoItem({ ...nuevoItem, id_producto: e.target.value })
  }
  required
  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C] outline-none"
>
  <option value="">-- Selecciona un producto --</option>
  {productos.length > 0 ? (
    productos.map((p) => (
      <option key={p.id_producto} value={p.id_producto}>
        {p.nombre}
      </option>
    ))
  ) : (
    <option disabled>No hay productos disponibles</option>
  )}
</select>

              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cantidad Inicial
                </label>
                <input
                  type="number"
                  value={nuevoItem.cantidad_inicial}
                  onChange={(e) =>
                    setNuevoItem({
                      ...nuevoItem,
                      cantidad_inicial: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Entradas
                </label>
                <input
                  type="number"
                  value={nuevoItem.entradas}
                  onChange={(e) =>
                    setNuevoItem({ ...nuevoItem, entradas: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Salidas
                </label>
                <input
                  type="number"
                  value={nuevoItem.salidas}
                  onChange={(e) =>
                    setNuevoItem({ ...nuevoItem, salidas: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C] outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#B71C1C] text-white font-semibold hover:bg-[#8B0000] transition"
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

export default Inventario;
