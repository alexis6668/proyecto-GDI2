import React, { useState, useEffect } from "react";
import { FaBuilding, FaUserCog, FaSun, FaMoon, FaSave } from "react-icons/fa";

function Configuracion() {
  const [empresa, setEmpresa] = useState({
    nombre: "FIAMBRERÍA PERÚ S.A.C.",
    ruc: "20567890123",
    direccion: "Av. Grau 456 - Tacna",
    correo: "contacto@fiambrieriaperu.com",
    telefono: "952341678",
    moneda: "Soles (S/)",
    igv: 18,
  });

  const [usuario, setUsuario] = useState({
    nombre: "Administrador",
    correo: "admin@fiambrieriaperu.com",
    rol: "Administrador General",
  });

  const [temaOscuro, setTemaOscuro] = useState(false);

  // Guardar cambios localmente
  useEffect(() => {
    const configGuardada = localStorage.getItem("configuracion");
    if (configGuardada) {
      const parsed = JSON.parse(configGuardada);
      setEmpresa(parsed.empresa || empresa);
      setUsuario(parsed.usuario || usuario);
      setTemaOscuro(parsed.temaOscuro || false);
    }
  }, []);

  const guardarConfiguracion = () => {
    const data = { empresa, usuario, temaOscuro };
    localStorage.setItem("configuracion", JSON.stringify(data));
    alert("✅ Configuración guardada correctamente.");
  };

  const handleChangeEmpresa = (e) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const handleChangeUsuario = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const alternarTema = () => {
    setTemaOscuro(!temaOscuro);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        temaOscuro ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-bold text-red-600 mb-6">Configuración</h1>

      {/* Sección: Datos de la Empresa */}
      <div
        className={`rounded-xl shadow-md p-6 mb-6 border ${
          temaOscuro ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaBuilding className="text-red-600" /> Datos de la Empresa
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la empresa"
            value={empresa.nombre}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="ruc"
            placeholder="RUC"
            value={empresa.ruc}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={empresa.direccion}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={empresa.correo}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={empresa.telefono}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="moneda"
            placeholder="Moneda"
            value={empresa.moneda}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="igv"
            placeholder="IGV (%)"
            value={empresa.igv}
            onChange={handleChangeEmpresa}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Sección: Perfil del Usuario */}
      <div
        className={`rounded-xl shadow-md p-6 mb-6 border ${
          temaOscuro ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserCog className="text-yellow-500" /> Perfil del Usuario
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del usuario"
            value={usuario.nombre}
            onChange={handleChangeUsuario}
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={usuario.correo}
            onChange={handleChangeUsuario}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="rol"
            placeholder="Rol"
            value={usuario.rol}
            onChange={handleChangeUsuario}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Sección: Apariencia */}
      <div
        className={`rounded-xl shadow-md p-6 mb-6 border flex justify-between items-center ${
          temaOscuro ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {temaOscuro ? (
            <>
              <FaMoon className="text-yellow-400" /> Modo Oscuro Activado
            </>
          ) : (
            <>
              <FaSun className="text-yellow-500" /> Modo Claro Activado
            </>
          )}
        </h2>
        <button
          onClick={alternarTema}
          className={`px-4 py-2 rounded font-semibold transition ${
            temaOscuro
              ? "bg-yellow-500 text-black hover:bg-yellow-400"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Cambiar Tema
        </button>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={guardarConfiguracion}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded flex items-center gap-2 font-semibold shadow-md"
        >
          <FaSave /> Guardar Configuración
        </button>
      </div>
    </div>
  );
}

export default Configuracion;
