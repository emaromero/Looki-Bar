export const fetchProducts = async () => {
    const SHEET_URL = "https://opensheet.elk.sh/1jB09lwmbSiT-gTLwcnOz7VMkOzsH3XvSBHUy7hgQIh4/menu";
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data.map(row => ({
            nombre: row.Nombre || "Sin nombre",
            descripcion: row.Descripción || "Sin descripción",
            precio: row.Precio ? parseFloat(row.Precio) : 0,
            imagen: row.Imagen && row.Imagen.trim() !== "" ? row.Imagen : "https://via.placeholder.com/150",
            categoria: row.Categoría || "Sin categoría",
            activo: row.Activo === "SI"
        }));
    } catch (error) {
        console.error("Error al cargar productos:", error);
        throw error;
    }
};