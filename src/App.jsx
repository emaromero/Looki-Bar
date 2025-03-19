import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProductModal from './components/ProductModal.jsx';
import CustomizeModal from './components/CustomizeModal.jsx';
import CartModal from './components/CartModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import Admin from './components/Admin.jsx';
import { fetchProducts } from './components/api.js';
import './styles.css';

function App() {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("carrito")) || []);
    const [categories, setCategories] = useState({});
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [isWelcome, setIsWelcome] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isWelcome) {
            setIsLoading(true);
            cargarProductos();
        }
    }, [isWelcome]);

    async function cargarProductos() {
        setIsLoading(true);
        try {
            const data = await fetchProducts();
            const categorias = {};
            data.forEach(producto => {
                if (producto.activo) {
                    const categoria = producto.categoria || "Sin categoría";
                    if (!categorias[categoria]) categorias[categoria] = [];
                    categorias[categoria].push(producto);
                }
            });
            setCategories(Object.keys(categorias).length ? categorias : { error: "No hay productos disponibles." });
        } catch (error) {
            setCategories({ error: "No se pudieron cargar los productos." });
        } finally {
            setIsLoading(false);
        }
    }

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("carrito", JSON.stringify(newCart));
    };

    const openProductModal = (producto) => {
        setCurrentProduct({ ...producto, cantidad: 1, comentario: "" });
        setShowCustomizeModal(false);
    };

    const handleEnter = () => setIsWelcome(false);

    const handleProceed = () => setShowCustomizeModal(true);

    const showConfirmationAlert = (message) => {
        setConfirmationMessage(message);
        setShowConfirmation(true);
    };

    if (isWelcome) {
        return (
            <div className="welcome-screen">
                <div className="welcome-content">
                    <img src="/images/logo-looki.png" alt="Logo" className="logo" />
                    <h2>Te damos la bienvenida a LOOKI BAR.<br />¿Delivery o Take Away?<br />¡Realiza tu pedido!</h2>
                    <button className="btn-loki" onClick={handleEnter}>Ingresar</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {isLoading && (
                <div id="loading-spinner">
                    <div className="loader"></div>
                </div>
            )}
            <div id="app-content" className={!isLoading ? '' : 'hidden'}>
                <Header />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home categories={categories} openProductModal={openProductModal} />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                    <Footer />
                </div>
                <div className="fixed-cart" onClick={() => setShowCart(true)}>
                    Ver carrito <span>${cart.reduce((sum, p) => sum + parseFloat(p.precio) * p.cantidad, 0).toFixed(2)}</span>
                </div>
                {currentProduct && !showCustomizeModal && (
                    <ProductModal
                        currentProduct={currentProduct}
                        onClose={() => setCurrentProduct(null)}
                        onProceed={handleProceed}
                    />
                )}
                {showCustomizeModal && currentProduct && (
                    <CustomizeModal
                        currentProduct={currentProduct}
                        setCurrentProduct={setCurrentProduct}
                        cart={cart}
                        updateCart={updateCart}
                        setShowCustomizeModal={setShowCustomizeModal}
                        showConfirmationAlert={showConfirmationAlert}
                    />
                )}
                {showCart && (
                    <CartModal
                        cart={cart}
                        setCart={updateCart}
                        onClose={() => setShowCart(false)}
                        showConfirmationAlert={showConfirmationAlert}
                    />
                )}
                <ConfirmationModal
                    message={confirmationMessage}
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                />
            </div>
        </div>
    );
}

function Home({ categories, openProductModal }) {
    return (
        <div id="categorias-container" className="accordion">
            {Object.keys(categories).length === 0 ? (
                <p>Cargando productos...</p>
            ) : categories.error ? (
                <p className="text-danger">{categories.error}</p>
            ) : (
                Object.keys(categories).map((categoria, index) => (
                    <div className="accordion-item" key={categoria}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                                className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${index}`}
                                aria-expanded={index === 0}
                                aria-controls={`collapse${index}`}
                            >
                                {categoria}
                            </button>
                        </h2>
                        <div
                            id={`collapse${index}`}
                            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#categorias-container"
                        >
                            <div className="accordion-body">
                                {categories[categoria].map((producto) => (
                                    <div
                                        key={producto.nombre}
                                        className="producto d-flex align-items-center p-3 border rounded mb-3"
                                        onClick={() => openProductModal(producto)}
                                    >
                                        <img
                                            src={producto.imagen || 'https://via.placeholder.com/80'}
                                            className="img-fluid me-3 rounded"
                                            style={{ width: '80px' }}
                                            alt={producto.nombre}
                                        />
                                        <div>
                                            <h5>{producto.nombre}</h5>
                                            <p className="text-muted">{producto.descripcion}</p>
                                        </div>
                                        <strong className="ms-auto">${Math.round(parseFloat(producto.precio || 0))}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default App;