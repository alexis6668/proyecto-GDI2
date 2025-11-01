import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { getData, createData, updateData, deleteData } from "../../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Facturacion() {
  const [comprobantes, setComprobantes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [ventas, setVentas] = useState([]);

  const [nuevo, setNuevo] = useState({
    id_venta: "",
    numero_factura: "",
    tipo_documento: "Boleta",
    monto_total: "",
    fecha_emision: "",
  });

  // 🔹 Cargar facturas y ventas
  useEffect(() => {
    cargarFacturas();
    cargarVentas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const data = await getData("facturacion");
      setComprobantes(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      toast.error("❌ No se pudieron obtener las facturas.");
    }
  };

  const cargarVentas = async () => {
    try {
      const data = await getData("ventas");
      setVentas(data);
    } catch (error) {
      console.error("Error cargando ventas:", error);
      toast.error("❌ No se pudieron obtener las ventas.");
    }
  };

  // 🔹 Generar número único
  const generarNumeroFactura = (tipo = "Boleta") => {
    const prefijo = tipo === "Factura" ? "F001" : "B001";
    const numero = Math.floor(Math.random() * 900000) + 100000;
    return `${prefijo}-${numero}`;
  };

  // 🔹 Abrir modal
  const abrirModal = (item = null) => {
    if (item) {
      setEditando(item.id_factura);
      setNuevo({
        id_venta: item.id_venta || "",
        numero_factura: item.numero_factura,
        tipo_documento: item.tipo_documento,
        monto_total: item.monto_total,
        fecha_emision: item.fecha_emision.split("T")[0],
      });
    } else {
      setEditando(null);
      setNuevo({
        id_venta: "",
        numero_factura: generarNumeroFactura(),
        tipo_documento: "Boleta",
        monto_total: "",
        fecha_emision: new Date().toISOString().split("T")[0],
      });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    setNuevo({
      id_venta: "",
      numero_factura: "",
      tipo_documento: "Boleta",
      monto_total: "",
      fecha_emision: "",
    });
  };

  // 🔹 Guardar o actualizar factura
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevo.id_venta) {
      toast.error("⚠️ Debes seleccionar una venta asociada.");
      return;
    }

    try {
      const payload = {
        ...nuevo,
        id_venta: Number(nuevo.id_venta),
        monto_total: Number(nuevo.monto_total || 0),
        numero_factura:
          nuevo.numero_factura.trim() || generarNumeroFactura(nuevo.tipo_documento),
        fecha_emision: nuevo.fecha_emision || new Date().toISOString().split("T")[0],
      };

      if (editando) {
        await updateData("facturacion", editando, payload);
        toast.success("✅ Factura actualizada correctamente.");
      } else {
        await createData("facturacion", payload);
        toast.success("✅ Factura registrada correctamente.");
      }

      setModalOpen(false);
      setEditando(null);
      cargarFacturas();
    } catch (error) {
      console.error("Error al guardar factura:", error);
      toast.error("❌ Error al guardar la factura.");
    }
  };

  // 🔹 Eliminar factura
  const eliminarFactura = async (id) => {
    if (confirm("¿Deseas eliminar este comprobante?")) {
      try {
        await deleteData("facturacion", id);
        toast.success("🗑️ Factura eliminada correctamente.");
        cargarFacturas();
      } catch (error) {
        console.error("Error al eliminar factura:", error);
        toast.error("❌ No se pudo eliminar la factura.");
      }
    }
  };

  // 🔹 Exportar PDF con todas las facturas
  const exportarPDF = () => {
    if (!comprobantes.length) {
      toast.error("⚠️ No hay facturas para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📋 Reporte de Facturación", 14, 20);

    const body = comprobantes.map((c, i) => [
      i + 1,
      c.numero_factura,
      c.cliente || "—",
      c.tipo_documento,
      `S/ ${Number(c.monto_total || 0).toFixed(2)}`,
      (c.fecha_emision || "").toString().split("T")[0] || "—",
    ]);

    autoTable(doc, {
      head: [["#", "N° Comprobante", "Cliente", "Tipo", "Monto (S/)", "Fecha"]],
      body,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [15, 44, 62] },
    });

    const total = comprobantes.reduce((acc, c) => acc + Number(c.monto_total || 0), 0);
    const finalY = (doc.lastAutoTable?.finalY ?? 30) + 10;

    doc.text(`💰 Total Facturado: S/ ${total.toFixed(2)}`, 14, finalY);
    doc.save("facturacion.pdf");
  };

  const totalFacturado = comprobantes.reduce(
    (acc, c) => acc + Number(c.monto_total || 0),
    0
  );

  return (
    <div className="p-8 bg-[#F7F8FA] min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#B71C1C]">Facturación</h1>
        <div className="flex gap-3">
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 bg-[#0F2C3E] text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
          >
            <Plus size={18} /> Nuevo Comprobante
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F2C3E] text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">N° Comprobante</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-center">Tipo</th>
              <th className="p-4 text-center">Monto (S/)</th>
              <th className="p-4 text-center">Fecha</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comprobantes.map((c, i) => (
              <tr key={c.id_factura} className="border-b hover:bg-gray-100 transition-all">
                <td className="p-4">{i + 1}</td>
                <td className="p-4 font-semibold text-[#0F2C3E]">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-[#D4AF37]" />
                    {c.numero_factura}
                  </div>
                </td>
                <td className="p-4">{c.cliente || "—"}</td>
                <td
                  className={`p-4 text-center font-semibold ${
                    c.tipo_documento === "Factura" ? "text-blue-700" : "text-green-700"
                  }`}
                >
                  {c.tipo_documento}
                </td>
                <td className="p-4 text-center text-[#0F2C3E] font-semibold">
                  S/ {Number(c.monto_total || 0).toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  {(c.fecha_emision || "").split?.("T")[0] || "—"}
                </td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => abrirModal(c)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => eliminarFactura(c.id_factura)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold text-[#0F2C3E]">
              <td colSpan="4" className="p-4 text-right">
                Total Facturado:
              </td>
              <td className="p-4 text-center">S/ {totalFacturado.toFixed(2)}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-2xl font-bold text-[#0F2C3E] mb-4">
              {editando ? "Editar Comprobante" : "Registrar Comprobante"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Venta asociada */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Venta Asociada
                </label>
                <select
                  value={nuevo.id_venta}
                  onChange={(e) => setNuevo({ ...nuevo, id_venta: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                >
                  <option value="">-- Selecciona una venta --</option>
                  {ventas.map((v) => (
                    <option key={v.id_venta} value={v.id_venta}>
                      {v.cliente} — S/ {v.total}
                    </option>
                  ))}
                </select>
              </div>

              {/* N° Comprobante */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  N° Comprobante
                </label>
                <input
                  type="text"
                  value={nuevo.numero_factura}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, numero_factura: e.target.value })
                  }
                  required
                  placeholder="Ej: F001-000123"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tipo de Comprobante
                </label>
                <select
                  value={nuevo.tipo_documento}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, tipo_documento: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                >
                  <option value="Boleta">Boleta</option>
                  <option value="Factura">Factura</option>
                </select>
              </div>

              {/* Monto */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Monto (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevo.monto_total}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, monto_total: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Fecha de Emisión
                </label>
                <input
                  type="date"
                  value={nuevo.fecha_emision}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, fecha_emision: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={cerrarModal}
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

export default Facturacion;
