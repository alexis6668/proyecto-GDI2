import React, { useState, useEffect } from "react";
import { Building2, Plus, Edit, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    ruc: "",
  });
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // 🔹 Cargar proveedores al inicio
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await getData("proveedores");
      setProveedores(data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      toast.error("❌ Error al obtener proveedores del servidor.");
    }
  };

  // 🔹 Validaciones antes de guardar
  const validarDatos = () => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{6,15}$/;
    const rucRegex = /^[0-9]{11}$/;

    if (!nuevoProveedor.nombre || !nuevoProveedor.telefono) {
      toast.error("⚠️ Completa nombre y teléfono.");
      return false;
    }
    if (!nombreRegex.test(nuevoProveedor.nombre)) {
      toast.error("❌ El nombre solo debe tener letras.");
      return false;
    }
    if (nuevoProveedor.correo && !correoRegex.test(nuevoProveedor.correo)) {
      toast.error("❌ Ingresa un correo válido.");
      return false;
    }
    if (!telefonoRegex.test(nuevoProveedor.telefono)) {
      toast.error("❌ Teléfono inválido (solo números).");
      return false;
    }
    if (nuevoProveedor.ruc && !rucRegex.test(nuevoProveedor.ruc)) {
      toast.error("❌ El RUC debe tener 11 dígitos.");
      return false;
    }
    return true;
  };

  // 🔹 Guardar o actualizar proveedor
  const handleGuardar = async () => {
  console.log("🟢 Guardar proveedor ejecutado:", nuevoProveedor);

  if (!validarDatos()) return;

  try {
    if (editando) {
      await updateData("proveedores", editando, nuevoProveedor);
      toast.success("✅ Proveedor actualizado correctamente.");
      setEditando(null);
    } else {
      await createData("proveedores", nuevoProveedor);
      toast.success("✅ Proveedor registrado correctamente.");
    }

    setNuevoProveedor({
      nombre: "",
      telefono: "",
      correo: "",
      direccion: "",
      ruc: "",
    });
    setMostrarModal(false);
    cargarProveedores();
  } catch (error) {
    console.error("Error al guardar proveedor:", error);
    toast.error("❌ Error al guardar proveedor.");
  }
};


  // 🔹 Editar
  const handleEditar = (proveedor) => {
    setNuevoProveedor(proveedor);
    setEditando(proveedor.id_proveedor);
    setMostrarModal(true);
  };

  // 🔹 Eliminar
  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este proveedor?")) {
      try {
        await deleteData("proveedores", id);
        toast.success("🗑️ Proveedor eliminado correctamente.");
        cargarProveedores();
      } catch (error) {
        console.error("Error eliminando proveedor:", error);
        toast.error("❌ No se pudo eliminar el proveedor.");
      }
    }
  };

  // 🔎 Filtro de búsqueda
  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ruc.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* 📊 Tarjetas resumen */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Total Proveedores</h3>
          <p className="text-3xl font-bold">{proveedores.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Registrados este mes</h3>
          <p className="text-3xl font-bold">+3</p>
        </div>

        <div className="bg-gradient-to-br from-[#0F2C3E] to-[#081A24] text-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Activos</h3>
          <p className="text-3xl font-bold">15</p>
        </div>
      </div>

      {/* 🔍 Buscador y botón */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Buscar proveedor por nombre, correo o RUC..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <button
          onClick={() => {
            setNuevoProveedor({
              nombre: "",
              telefono: "",
              correo: "",
              direccion: "",
              ruc: "",
            });
            setEditando(null);
            setMostrarModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nuevo Proveedor
        </button>
      </div>

      {/* 📋 Tabla */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0F2C3E] text-white">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">RUC</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Dirección</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p, index) => (
              <tr
                key={p.id_proveedor}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4">{p.id_proveedor}</td>
                <td className="py-3 px-4 font-semibold">{p.nombre}</td>
                <td className="py-3 px-4">{p.ruc}</td>
                <td className="py-3 px-4">{p.telefono}</td>
                <td className="py-3 px-4">{p.correo}</td>
                <td className="py-3 px-4">{p.direccion}</td>
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditar(p)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id_proveedor)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {proveedoresFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💬 Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
              <Building2 /> {editando ? "Editar Proveedor" : "Registrar Proveedor"}
            </h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoProveedor.nombre}
                onChange={(e) =>
                  setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="text"
                placeholder="RUC"
                value={nuevoProveedor.ruc}
                onChange={(e) =>
                  setNuevoProveedor({ ...nuevoProveedor, ruc: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={nuevoProveedor.telefono}
                onChange={(e) =>
                  setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={nuevoProveedor.correo}
                onChange={(e) =>
                  setNuevoProveedor({ ...nuevoProveedor, correo: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={nuevoProveedor.direccion}
                onChange={(e) =>
                  setNuevoProveedor({
                    ...nuevoProveedor,
                    direccion: e.target.value,
                  })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                onClick={handleGuardar}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
              >
                {editando ? "Actualizar Proveedor" : "Guardar Proveedor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proveedores;
