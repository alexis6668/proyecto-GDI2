import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { FaRobot } from "react-icons/fa";

// Datos simulados (puedes reemplazarlos por los de tu backend)
const ventasMensuales = [
  { mes: "Ene", total: 12000 },
  { mes: "Feb", total: 15000 },
  { mes: "Mar", total: 18000 },
  { mes: "Abr", total: 22000 },
  { mes: "May", total: 19500 },
  { mes: "Jun", total: 25000 },
];

const productosMasVendidos = [
  { name: "Jamón", value: 35 },
  { name: "Chorizo", value: 25 },
  { name: "Salchicha", value: 20 },
  { name: "Tocino", value: 10 },
  { name: "Otros", value: 10 },
];

const COLORS = ["#276be9ff", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

function Dashboard() {
  const [prediccion, setPrediccion] = useState(null);

  useEffect(() => {
    calcularPrediccion();
  }, []);

  // 🔹 Función de predicción simple (regresión lineal)
  const calcularPrediccion = () => {
    const n = ventasMensuales.length;
    const x = Array.from({ length: n }, (_, i) => i + 1);
    const y = ventasMensuales.map((v) => v.total);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    const nextMonthX = n + 1;
    const nextPrediction = m * nextMonthX + b;

    const porcentajeCambio =
      ((nextPrediction - y[y.length - 1]) / y[y.length - 1]) * 100;

    setPrediccion({
      valor: nextPrediction,
      cambio: porcentajeCambio,
      tendencia: porcentajeCambio >= 0 ? "sube" : "baja",
    });
  };

  // 🔹 Datos extendidos para incluir predicción en el gráfico
  const datosConPrediccion = [
    ...ventasMensuales,
    { mes: "Jul", total: prediccion ? prediccion.valor : null },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-700 mb-6">Panel General</h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al sistema de gestión de ventas de{" "}
        <strong>FIAMBRERÍA PERÚ S.A.C.</strong>
      </p>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500 text-sm">Ventas Totales</h2>
          <p className="text-2xl font-bold text-red-600">S/ 82,500</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500 text-sm">Clientes Nuevos</h2>
          <p className="text-2xl font-bold text-red-600">+240</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-gray-500 text-sm">Productos en Stock</h2>
          <p className="text-2xl font-bold text-red-600">154</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Línea de Ventas + Predicción */}
        <div className="bg-white p-6 rounded-xl shadow-lg border relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaRobot className="text-blue-600" /> Predicción de Ventas
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosConPrediccion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#dc2626"
                strokeWidth={3}
                name="Ventas"
              />
              <Line
                type="monotone"
                dataKey="total"
                data={[datosConPrediccion[datosConPrediccion.length - 2], datosConPrediccion[datosConPrediccion.length - 1]]}
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Proyección"
              />
            </LineChart>
          </ResponsiveContainer>

          {prediccion && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center border">
              <p className="text-gray-700 text-sm mb-2">
                🔮 Proyección para el próximo mes:
              </p>
              <p className="text-2xl font-bold text-blue-600">
                S/ {prediccion.valor.toFixed(2)}
              </p>
              <p
                className={`mt-2 font-semibold ${
                  prediccion.tendencia === "sube"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {prediccion.tendencia === "sube"
                  ? `📈 Se proyecta un aumento del ${prediccion.cambio.toFixed(
                      1
                    )}%`
                  : `📉 Se estima una caída del ${Math.abs(
                      prediccion.cambio
                    ).toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Productos Más Vendidos
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={productosMasVendidos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {productosMasVendidos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
