import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Ventas from "./pages/admin/Ventas";
import Inventario from "./pages/admin/Inventario";
import Facturacion from "./pages/admin/Facturacion";
import Productos from "./pages/admin/Productos";
import Clientes from "./pages/admin/Clientes";
import Proveedores from "./pages/admin/Proveedores";
import Compras from "./pages/admin/Compras";
import Reportes from "./pages/admin/Reportes";
import Configuracion from "./pages/admin/Configuracion";
import Sidebar from "./components/sidebar";

import { Toaster } from "react-hot-toast";


function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoggedIn(true);
      navigate("/dashboard");
    } else {
      alert("Por favor, completa ambos campos.");
    }
  };

  if (!loggedIn) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/fond1r.jpg')" }}
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-red-500 transition-all duration-300 hover:shadow-red-300">
          <div className="flex flex-col items-center mb-8">
            <Utensils className="w-12 h-12 text-red-500 mb-2" />
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-red-400 shadow-md">
              <img src="/public/ryu.jpg" alt="Logo" className="object-cover w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mt-4 text-center">
              FIAMBRERÍA PERÚ S.A.C.
            </h1>
            <p className="text-gray-600 text-sm italic mt-2">
              “Calidad y sabor en cada bocado”
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-lg"
            >
              Iniciar sesión
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Olvidaste tu contraseña?{" "}
              <a href="#" className="text-red-500 hover:underline">
                Recuperar
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // 🔥 Panel con menú lateral
  return (
    <>
      {/* ✅ Toaster global para toda la app */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
