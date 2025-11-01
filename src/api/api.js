const API_URL = "http://localhost:4000/api";

// 📥 Obtener datos (GET)
export async function getData(endpoint) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`❌ Error al obtener datos de ${endpoint}:`, error);
    throw error;
  }
}

// ➕ Crear registro (POST)
export async function createData(endpoint, data) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`❌ Error al crear en ${endpoint}:`, error);
    throw error;
  }
}

// ✏️ Actualizar registro (PUT)
export async function updateData(endpoint, id, data) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`❌ Error al actualizar en ${endpoint}:`, error);
    throw error;
  }
}

// 🗑️ Eliminar registro (DELETE)
export async function deleteData(endpoint, id) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`❌ Error al eliminar en ${endpoint}:`, error);
    throw error;
  }
}
