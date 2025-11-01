import React, { useState, useEffect } from "react";
import { User, Plus, Edit, Trash2, Search, X } from "lucide-react";
import { getData, createData, updateData, deleteData } from "../../api/api";
import toast from "react-hot-toast";





function Clientes() {
  const [clientes, setClientes] = useState([]);


  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

useEffect(() => {
  cargarClientes();
}, []);

const cargarClientes = async () => {
  const data = await getData("clientes");
  setClientes(data);
};

  // 🧩 Guardar cliente
const handleGuardar = async () => {
  // Validaciones básicas
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[0-9]{6,15}$/;

  if (!nuevoCliente.nombre || !nuevoCliente.telefono) {
    alert("⚠️ Por favor, completa al menos nombre y teléfono.");
    return;
  }

  if (!nombreRegex.test(nuevoCliente.nombre)) {
    alert("❌ El nombre solo puede contener letras y espacios.");
    return;
  }

  if (nuevoCliente.correo && !correoRegex.test(nuevoCliente.correo)) {
    alert("❌ Ingresa un correo electrónico válido (debe incluir @).");
    return;
  }

  if (!telefonoRegex.test(nuevoCliente.telefono)) {
    alert("❌ El teléfono debe contener solo números (6 a 15 dígitos).");
    return;
  }

try {
  if (editando) {
    await updateData("clientes", editando, nuevoCliente);
    toast.success("Cliente actualizado correctamente ✅");
    setEditando(null);
  } else {
    await createData("clientes", nuevoCliente);
    toast.success("Cliente registrado correctamente 🧾");
  }

  setNuevoCliente({ nombre: "", telefono: "", correo: "", direccion: "" });
  setMostrarModal(false);
  cargarClientes();
} catch (error) {
  console.error("Error al guardar cliente:", error);
  toast.error("❌ Hubo un error al guardar el cliente.");
}

};


// 🧩 Editar cliente
const handleEditar = (cliente) => {
  setNuevoCliente(cliente);
  setEditando(cliente.id_cliente); // 👈 usa id_cliente del backend
  setMostrarModal(true);
};

// 🧩 Eliminar cliente
const handleEliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este cliente?")) {
    await deleteData("clientes", id);
    cargarClientes();
  }
};

  // 🔍 Filtro de búsqueda
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* 📊 Tarjetas flotantes */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Clientes Totales</h3>
          <p className="text-3xl font-bold">{clientes.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Nuevos este mes</h3>
          <p className="text-3xl font-bold">+5</p>
        </div>

        <div className="bg-gradient-to-br from-[#0F2C3E] to-[#081A24] text-white rounded-xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Clientes Frecuentes</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      {/* 🧭 Barra superior */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Buscar cliente por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <button
          onClick={() => {
            setNuevoCliente({ nombre: "", telefono: "", correo: "", direccion: "" });
            setEditando(null);
            setMostrarModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* 📋 Tabla */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0F2C3E] text-white">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Dirección</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {clientesFiltrados.map((cliente, index) => (
  <tr key={cliente.id_cliente} 

                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4">{cliente.id_cliente}</td>
                <td className="py-3 px-4 font-semibold">{cliente.nombre}</td>
                <td className="py-3 px-4">{cliente.telefono}</td>
                <td className="py-3 px-4">{cliente.correo}</td>
                <td className="py-3 px-4">{cliente.direccion}</td>
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditar(cliente)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente.id_cliente)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4 italic">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💬 Modal flotante */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
              <User /> {editando ? "Editar Cliente" : "Registrar Cliente"}
            </h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevoCliente.nombre}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={nuevoCliente.telefono}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={nuevoCliente.correo}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, correo: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={nuevoCliente.direccion}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
                }
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none"
              />

              <button
                onClick={handleGuardar}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
              >
                {editando ? "Actualizar Cliente" : "Guardar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
