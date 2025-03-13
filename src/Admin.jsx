import React, { useState, useEffect } from 'react';

const SHEET_URL = "https://opensheet.elk.sh/1oVfG1dhrkutkOWe7hELdONDnQyRTtSYITpoYHvpTZLQ/menu";
const PASSWORD_CORRECTA = ""; // Cambia esta contraseña según necesites

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const pass = prompt("Ingrese la contraseña de administrador:");
        if (pass === PASSWORD_CORRECTA) {
            setIsAuthenticated(true);
            cargarProductos();
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    async function cargarProductos() {
        setLoading(true);
        try {
            const response = await fetch(SHEET_URL);
            const data = await response.json();
            console.log("📥 Datos recibidos de Google Sheets:", data);

            const productos = data.map(row => ({
                nombre: row.Nombre || "Sin nombre",
                descripcion: row.Descripción || "Sin descripción",
                precio: row.Precio ? parseFloat(row.Precio) : 0,
                imagen: row.Imagen && row.Imagen.trim() !== "" ? row.Imagen : "https://via.placeholder.com/150",
                categoria: row.Categoría || "Sin categoría",
                activo: row.Activo === "SI"
            }));

            localStorage.setItem('productos', JSON.stringify(productos));
            setProducts(productos.filter(product => product.activo));
            setLoading(false);
            setMessage("✅ Productos actualizados correctamente.");
        } catch (error) {
            console.error('❌ Error al obtener los productos:', error);
            setLoading(false);
            setMessage("❌ Error al cargar productos.");
        }
    }

    if (!isAuthenticated) {
        return <h2 className="text-center text-danger mt-5">Acceso denegado</h2>;
    }

    const categories = {};
    products.forEach(product => {
        if (!categories[product.categoria]) categories[product.categoria] = [];
        categories[product.categoria].push(product);
    });

    return (
        <div className="container" id="admin-panel">
            <h1 className="my-4 text-center">Administración de Productos</h1>
            <div className={`loader ${loading ? '' : 'hidden'}`}>Cargando productos...</div>
            <div id="productos-container">
                {products.length === 0 && !loading ? (
                    <p>No hay productos disponibles.</p>
                ) : (
                    Object.keys(categories).map(cat => (
                        <div className="mb-4" key={cat}>
                            <h3>{cat}</h3>
                            {categories[cat].map(product => (
                                <div
                                    key={product.nombre}
                                    className="producto d-flex align-items-center mb-3 p-3 border rounded"
                                >
                                    <img
                                        src={product.imagen}
                                        className="img-fluid me-3"
                                        alt={product.nombre}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h5>{product.nombre}</h5>
                                        <p className="text-muted">{product.descripcion}</p>
                                    </div>
                                    <strong className="ms-auto">${product.precio.toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
            <p className="text-center mt-3">{message}</p>
        </div>
    );
}

export default Admin;