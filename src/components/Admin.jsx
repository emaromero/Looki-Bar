import React, { useState } from 'react';
import { fetchProducts } from './api.js';

const PASSWORD_CORRECTA = process.env.REACT_APP_ADMIN_PASSWORD;

function Admin() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === PASSWORD_CORRECTA) {
            setIsAuthenticated(true);
            cargarProductos();
        } else {
            setMessage("❌ Contraseña incorrecta");
        }
    };

    async function cargarProductos() {
        setLoading(true);
        try {
            const cachedProducts = JSON.parse(localStorage.getItem('productos'));
            if (cachedProducts) {
                setProducts(cachedProducts.filter(product => product.activo));
                setMessage("✅ Productos cargados desde caché.");
            } else {
                const productos = await fetchProducts();
                localStorage.setItem('productos', JSON.stringify(productos));
                setProducts(productos.filter(product => product.activo));
                setMessage("✅ Productos actualizados desde Google Sheets.");
            }
        } catch (error) {
            setMessage("❌ Error al cargar productos.");
        } finally {
            setLoading(false);
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="container mt-5">
                <h2 className="text-center">Iniciar sesión como administrador</h2>
                <form onSubmit={handleLogin} className="d-flex flex-column align-items-center">
                    <input
                        type="password"
                        className="form-control w-25 mt-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                    <button type="submit" className="btn btn-primary mt-3">Ingresar</button>
                </form>
                <p className="text-center mt-3 text-danger">{message}</p>
            </div>
        );
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