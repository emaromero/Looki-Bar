import React, { useState, useEffect } from 'react';
import * as bootstrap from 'bootstrap';

function CartModal({ cart, setCart, onClose, showConfirmationAlert }) {
    const [delivery, setDelivery] = useState(false);
    const [takeaway, setTakeaway] = useState(false);
    const [name, setName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("efectivo");
    const [cashAmount, setCashAmount] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [betweenStreets, setBetweenStreets] = useState("");
    const [locality, setLocality] = useState("");
    const [orderComment, setOrderComment] = useState("");
    const [coupon, setCoupon] = useState("");

    useEffect(() => {
        const modal = new bootstrap.Modal(document.getElementById('carrito'), { keyboard: false });
        modal.show();
        document.getElementById('nombre')?.focus();

        const cleanUpModal = () => {
            modal.hide();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        };

        return cleanUpModal;
    }, []);

    useEffect(() => {
        const adjustCartPosition = () => {
            const footer = document.querySelector("footer");
            const cartElement = document.querySelector(".fixed-cart");
            if (!footer || !cartElement) return;

            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Verificar si el footer está visible en la ventana
            const isFooterVisible = footerRect.top < windowHeight && footerRect.bottom > 0;
            const footerHeight = footer.offsetHeight;
            const marginAboveFooter = 10; // Margen por encima del footer cuando está visible

            if (isFooterVisible) {
                // Footer está visible: proyectar el carrito justo encima del footer
                const spaceToFooter = windowHeight - footerRect.top - footerHeight;
                const newBottom = Math.max(5, spaceToFooter + marginAboveFooter); // Mínimo 5px
                cartElement.style.bottom = `${newBottom}px`;
            } else {
                // Footer no está visible: posicionar el carrito completamente abajo
                cartElement.style.bottom = `0px`;
            }

            // Debugging: Mostrar valores en consola para verificar
            console.log({
                isFooterVisible,
                footerTop: footerRect.top,
                windowHeight,
                footerHeight,
                bottom: cartElement.style.bottom,
            });
        };

        window.addEventListener("scroll", adjustCartPosition);
        window.addEventListener("resize", adjustCartPosition);
        adjustCartPosition();

        return () => {
            window.removeEventListener("scroll", adjustCartPosition);
            window.removeEventListener("resize", adjustCartPosition);
        };
    }, []);

    const handleClose = () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('carrito'));
        modal.hide();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        onClose();
    };

    const handleDelivery = () => {
        setDelivery(true);
        setTakeaway(false);
    };

    const handleTakeaway = () => {
        setTakeaway(true);
        setDelivery(false);
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const sendOrder = () => {
        if (cart.length === 0) {
            showConfirmationAlert(`
                <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                El carrito está vacío. Agrega productos antes de enviar el pedido.
            `);
            return;
        }
        if (!name || (!delivery && !takeaway)) {
            showConfirmationAlert(`
                <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                Por favor, completa los campos obligatorios: Nombre y elige Delivery o Takeaway.
            `);
            return;
        }
        if (delivery && (!deliveryAddress || !locality)) {
            showConfirmationAlert(`
                <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                Para Delivery, completa Domicilio y Localidad.
            `);
            return;
        }

        let mensaje = "*Hola! Quiero hacer un pedido:*\n\n";
        cart.forEach(prod => {
            mensaje += `${prod.cantidad}x ${prod.Nombre} - $${Math.round(parseFloat(prod.Precio) * prod.cantidad)} ${prod.comentario ? `(${prod.comentario})` : ""}\n`;
        });
        const total = cart.reduce((sum, p) => sum + parseFloat(p.Precio) * p.cantidad, 0);
        mensaje += `\n*Total:* $${Math.round(total)}\n\n`;
        mensaje += `*Nombre:* ${name}\n`;

        if (delivery) {
            mensaje += `*Domicilio:* ${deliveryAddress}\n`;
            if (betweenStreets) mensaje += `Entre calles: ${betweenStreets}\n`;
            mensaje += `*Localidad:* ${locality}\n`;
        } else if (takeaway) {
            mensaje += "*Retiro:* Av Caamaño 844, Pilar\n";
        }

        mensaje += `*Forma de pago:* ${paymentMethod}`;
        if (paymentMethod === "efectivo" && cashAmount) mensaje += ` (Con: ${cashAmount})`;
        mensaje += "\n";
        if (orderComment) mensaje += `Comentario: ${orderComment}\n`;
        if (coupon) mensaje += `Cupón: ${coupon}\n`;

        // Mostrar confirmación brevemente antes de redirigir
        showConfirmationAlert(`
            <span style="color: green; font-size: 2rem;">✅</span><br>
            ¡Tu pedido ha sido enviado con éxito!
        `);

        // Cerrar el modal inmediatamente
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('carrito'));
        cartModal.hide();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();

        // Redirigir a WhatsApp de inmediato
        const whatsappUrl = `https://wa.me/5491140445556?text=${encodeURIComponent(mensaje)}`;
        console.log("WhatsApp URL:", whatsappUrl); // Para depuración
        window.location.href = whatsappUrl; // Envío inmediato
        handleClose(); // Asegurar que el modal se cierre
    };

    return (
        <div className="modal fade" id="carrito" tabIndex="-1" aria-labelledby="carritoLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="carritoLabel">Carrito</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-unstyled">
                            {cart.map((producto, index) => (
                                <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                                    {`${producto.cantidad}x ${producto.Nombre} - $${Math.round(parseFloat(producto.Precio) * producto.cantidad)} ${producto.comentario ? `(${producto.comentario})` : ""}`}
                                    <button className="btn btn-danger ms-2" onClick={() => removeItem(index)}>X</button>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <strong>Total: <span>${Math.round(cart.reduce((sum, p) => sum + parseFloat(p.Precio) * p.cantidad, 0))}</span></strong>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                id="nombre"
                                type="text"
                                className="form-control mt-2"
                                placeholder="Nombre y Apellido*"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {name && (
                                <div className="mt-3">
                                    <button type="button" className={`btn btn-primary me-2 ${delivery ? 'btn-active' : ''}`} onClick={handleDelivery}>Delivery</button>
                                    <button type="button" className={`btn btn-secondary ${takeaway ? 'btn-active' : ''}`} onClick={handleTakeaway}>Takeaway</button>
                                </div>
                            )}
                            {delivery && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Domicilio*"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Entre calles"
                                        value={betweenStreets}
                                        onChange={(e) => setBetweenStreets(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Localidad*"
                                        value={locality}
                                        onChange={(e) => setLocality(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            {takeaway && (
                                <div className="mt-2">
                                    <p className="text-muted">Te esperamos para retirar en Av Caamaño 844, Pilar.</p>
                                    <iframe
                                        className="mini-mapa"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3292.708605698858!2d-58.846448!3d-34.4149642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9dc154eca599%3A0x2270a90209fea6f8!2sR.%20Caama%C3%B1o%20844%2C%20B1631%20Villa%20Rosa%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1698259200000!5m2!1ses!2sar"
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Mapa de ubicación de Av Caamaño 844, Pilar"
                                    ></iframe>
                                </div>
                            )}
                            <label className="mt-2">Forma de pago*</label>
                            <select
                                className="form-control mt-1"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                            {paymentMethod === "efectivo" && (
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="¿Con cuánto?"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                />
                            )}
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Comentario opcional"
                                value={orderComment}
                                onChange={(e) => setOrderComment(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="¿Tenés algún cupón?"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                            />
                        </form>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={sendOrder}>Enviar pedido por WhatsApp</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartModal;