import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { FaChartBar, FaChartPie, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reportes() {
  const [data, setData] = useState(null);
  const COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"];

  // 🔹 Cargar datos del backend
  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/reportes");
        if (!res.ok) throw new Error("Error al obtener los reportes");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
        toast.error("❌ No se pudieron obtener los reportes.");
      }
    };
    cargarReportes();
  }, []);

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-600 font-semibold">
        Cargando reportes...
      </div>
    );
  }

  const ingresosTotales = data.ingresos;
  const egresosTotales = data.egresos;
  const utilidad = data.utilidad;

  // 🔹 Preparar datos para gráficos
  const ventasMensuales = data.ventasMensuales.map((v) => ({
    mes: v.mes.substring(0, 3),
    ventas: Number(v.total),
  }));

  const comprasMensuales = data.comprasMensuales.map((c) => ({
    mes: c.mes.substring(0, 3),
    compras: Number(c.total),
  }));

  const productosMasVendidos = data.productos.map((p) => ({
    nombre: p.producto,
    ventas: Number(p.total_vendido),
  }));

  const clientesNuevos = data.clientes.map((c) => ({
    mes: c.mes.substring(0, 3),
    clientes: Number(c.total),
  }));

  // 🔹 Exportar a PDF (con fix para el error "oklch")
  const exportarPDF = async () => {
    try {
      const reportElement = document.getElementById("reporte-completo");
      if (!reportElement) {
        toast.error("No se encontró el contenido para exportar.");
        return;
      }

      // 🧩 Solución temporal al error 'oklch' y 'oklab'
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const bg = computedStyle.backgroundColor;
        if (bg.includes("oklch") || bg.includes("oklab")) {
          el.style.backgroundColor = "#ffffff";
        }
        const color = computedStyle.color;
        if (color.includes("oklch") || color.includes("oklab")) {
          el.style.color = "#000000";
        }
      });

      // Fondo blanco global
      document.body.style.backgroundColor = "#ffffff";

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("reporte-general.pdf");
      toast.success("📄 Reporte exportado correctamente");
    } catch (error) {
      console.error("Error exportando PDF:", error);
      toast.error("❌ Error al exportar el reporte.");
    }
  };

  return (
    <div className="p-6" id="reporte-completo">
      <h1 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <FaChartBar /> Reportes Generales
      </h1>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm">Ingresos Totales</p>
          <h2 className="text-3xl font-bold">
            S/ {ingresosTotales.toLocaleString()}
          </h2>
        </div>
        <div className="bg-red-600 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm">Egresos Totales</p>
          <h2 className="text-3xl font-bold">
            S/ {egresosTotales.toLocaleString()}
          </h2>
        </div>
        <div className="bg-yellow-500 text-white p-5 rounded-xl shadow-md">
          <p className="text-sm">Utilidad Neta</p>
          <h2 className="text-3xl font-bold">
            S/ {utilidad.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Fila de gráficos */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Ventas vs Compras */}
        <div className="bg-white rounded-xl shadow-md p-4 border">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Ventas vs Compras (Mensual)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#ef4444" name="Ventas (S/)" />
              <Bar
                dataKey={(obj) =>
                  comprasMensuales.find((c) => c.mes === obj.mes)?.compras
                }
                fill="#facc15"
                name="Compras (S/)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-xl shadow-md p-4 border">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Productos más vendidos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productosMasVendidos}
                dataKey="ventas"
                nameKey="nombre"
                outerRadius={120}
                label
              >
                {productosMasVendidos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-2 gap-6">
        {/* Clientes nuevos */}
        <div className="bg-white rounded-xl shadow-md p-4 border">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Nuevos clientes por mes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientesNuevos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clientes"
                stroke="#22c55e"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen de Rentabilidad */}
        <div className="bg-white rounded-xl shadow-md p-4 border flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Resumen de Rentabilidad
          </h2>
          <h3 className="text-4xl font-bold text-green-600">
            S/ {utilidad.toLocaleString()}
          </h3>
          <p className="text-gray-500 mt-2">Utilidad neta del periodo</p>
          <FaChartPie className="text-red-600 text-6xl mt-4" />
          <button
            onClick={exportarPDF}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <FaDownload /> Exportar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
