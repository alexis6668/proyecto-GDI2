import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);

  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: "",
    fecha: "",
    metodo_pago: "Efectivo",
    estado: "Pagado",
    detalles: [],
  });

  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_producto: "",
    cantidad: 1,
    precio_unitario: 0,
  });

  // 🔹 Cargar datos al inicio
  useEffect(() => {
    cargarVentas();
    cargarClientes();
    cargarProductos();
  }, []);

  const cargarVentas = async () => {
    try {
      const data = await getData("ventas");
      setVentas(data);
    } catch (error) {
      console.error("Error cargando ventas:", error);
      toast.error("❌ No se pudieron obtener las ventas.");
    }
  };

  const cargarClientes = async () => {
    try {
      const data = await getData("clientes");
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      toast.error("❌ No se pudieron cargar los clientes.");
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

  // 🔹 Agregar producto a los detalles
  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto) {
      toast.error("⚠️ Selecciona un producto.");
      return;
    }
    setNuevaVenta({
      ...nuevaVenta,
      detalles: [...nuevaVenta.detalles, nuevoDetalle],
    });
    setNuevoDetalle({ id_producto: "", cantidad: 1, precio_unitario: 0 });
  };

  // 🔹 Calcular total
  const calcularTotal = () => {
    return nuevaVenta.detalles.reduce(
      (acc, det) => acc + det.cantidad * det.precio_unitario,
      0
    );
  };

  // 🔹 Guardar o actualizar venta
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nuevaVenta.id_cliente) {
      toast.error("⚠️ Debes seleccionar un cliente.");
      return;
    }

    if (nuevaVenta.detalles.length === 0) {
      toast.error("⚠️ Debes agregar al menos un producto.");
      return;
    }

    const dataToSend = {
      ...nuevaVenta,
      total: calcularTotal(),
    };

    try {
      if (editando) {
        await updateData("ventas", editando, dataToSend);
        toast.success("✅ Venta actualizada correctamente.");
      } else {
        await createData("ventas", dataToSend);
        toast.success("✅ Venta registrada correctamente.");
      }

      setModalOpen(false);
      setEditando(null);
      setNuevaVenta({
        id_cliente: "",
        fecha: "",
        metodo_pago: "Efectivo",
        estado: "Pagado",
        detalles: [],
      });
      cargarVentas();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      toast.error("❌ Error al registrar la venta.");
    }
  };

  // 🔹 Editar venta
  const editarVenta = (venta) => {
    setEditando(venta.id_venta);
    setNuevaVenta({
      id_cliente: venta.id_cliente,
      fecha: venta.fecha.split("T")[0],
      metodo_pago: venta.metodo_pago,
      estado: venta.estado,
      detalles: [], // podrías cargar los detalles si los manejas aparte
    });
    setModalOpen(true);
  };

  // 🔹 Eliminar venta
  const eliminarVenta = async (id) => {
    if (confirm("¿Deseas eliminar esta venta?")) {
      try {
        await deleteData("ventas", id);
        toast.success("🗑️ Venta eliminada correctamente.");
        cargarVentas();
      } catch (error) {
        console.error("Error eliminando venta:", error);
        toast.error("❌ No se pudo eliminar la venta.");
      }
    }
  };

  return (
    <div className="p-8 bg-[#F7F8FA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#B71C1C]">Ventas</h1>
        <button
          onClick={() => {
            setEditando(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
        >
          <Plus size={18} /> Registrar Venta
        </button>
      </div>

      {/* 🔍 Buscador */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center border rounded-lg px-3 bg-white shadow-sm">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar cliente o método de pago..."
            className="px-3 py-2 outline-none w-64"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F2C3E] text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-center">Fecha</th>
              <th className="p-4 text-center">Total (S/)</th>
              <th className="p-4 text-center">Método de Pago</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas
              .filter((v) =>
                [v.cliente, v.metodo_pago, v.estado]
                  .some((campo) =>
                    campo?.toLowerCase().includes(busqueda.toLowerCase())
                  )
              )
              .map((v, i) => (
                <tr key={v.id_venta} className="border-b hover:bg-gray-100 transition-all">
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4 font-semibold text-gray-800">{v.cliente}</td>
                  <td className="p-4 text-center">
                    {new Date(v.fecha).toLocaleDateString("es-PE")}
                  </td>
                  <td className="p-4 text-center font-semibold text-[#0F2C3E]">
                    S/ {Number(v.total).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">{v.metodo_pago}</td>
                  <td
                    className={`p-4 text-center font-semibold ${
                      v.estado === "Pagado" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {v.estado}
                  </td>
                  <td className="p-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => editarVenta(v)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => eliminarVenta(v.id_venta)}
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
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
            <h2 className="text-2xl font-bold text-[#0F2C3E] mb-4">
              {editando ? "Editar Venta" : "Registrar Venta"}
            </h2>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  value={nuevaVenta.id_cliente}
                  onChange={(e) =>
                    setNuevaVenta({ ...nuevaVenta, id_cliente: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C] outline-none"
                >
                  <option value="">-- Selecciona un cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={nuevaVenta.fecha}
                    onChange={(e) =>
                      setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Método de pago
                  </label>
                  <select
                    value={nuevaVenta.metodo_pago}
                    onChange={(e) =>
                      setNuevaVenta({
                        ...nuevaVenta,
                        metodo_pago: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Yape">Yape</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={nuevaVenta.estado}
                    onChange={(e) =>
                      setNuevaVenta({
                        ...nuevaVenta,
                        estado: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <hr className="my-4" />

              {/* Detalle de productos */}
              <div>
                <h3 className="text-lg font-semibold text-[#0F2C3E] mb-2">
                  Productos
                </h3>
                <div className="flex gap-4 mb-3">
                  <select
                    value={nuevoDetalle.id_producto}
                    onChange={(e) =>
                      setNuevoDetalle({
                        ...nuevoDetalle,
                        id_producto: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                  >
                    <option value="">-- Selecciona producto --</option>
                    {productos.map((p) => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Cant."
                    value={nuevoDetalle.cantidad}
                    onChange={(e) =>
                      setNuevoDetalle({
                        ...nuevoDetalle,
                        cantidad: Number(e.target.value),
                      })
                    }
                    className="w-24 px-2 py-2 border rounded-lg text-center"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={nuevoDetalle.precio_unitario}
                    onChange={(e) =>
                      setNuevoDetalle({
                        ...nuevoDetalle,
                        precio_unitario: Number(e.target.value),
                      })
                    }
                    className="w-32 px-2 py-2 border rounded-lg text-center"
                  />
                  <button
                    type="button"
                    onClick={agregarDetalle}
                    className="px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Agregar
                  </button>
                </div>

                {nuevaVenta.detalles.length > 0 && (
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Producto</th>
                        <th className="p-2 text-center">Cantidad</th>
                        <th className="p-2 text-center">Precio</th>
                        <th className="p-2 text-center">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nuevaVenta.detalles.map((d, i) => {
                        const producto = productos.find(
                          (p) => p.id_producto == d.id_producto
                        );
                        return (
                          <tr key={i}>
                            <td className="p-2">{producto?.nombre || "N/A"}</td>
                            <td className="p-2 text-center">{d.cantidad}</td>
                            <td className="p-2 text-center">
                              S/ {d.precio_unitario}
                            </td>
                            <td className="p-2 text-center">
                              S/ {(d.cantidad * d.precio_unitario).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditando(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#B71C1C] text-white font-semibold hover:bg-[#8B0000] transition"
                >
                  {editando ? "Actualizar Venta" : `Guardar Venta (S/ ${calcularTotal().toFixed(2)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;
