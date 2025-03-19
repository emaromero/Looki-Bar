import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as bootstrap from 'bootstrap';
import { cleanModalBackdrop } from './ModalUtils';

function CartModal({ cart, setCart, onClose, showConfirmationAlert }) {
    const [delivery, setDelivery] = useState(false);
    const [takeaway, setTakeaway] = useState(false);
    const [name, setName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cashAmount, setCashAmount] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [betweenStreets, setBetweenStreets] = useState("");
    const [locality, setLocality] = useState("");
    const [orderComment, setOrderComment] = useState("");
    const [coupon, setCoupon] = useState("");
    const nameInputRef = useRef(null);

    const handleClose = useCallback(() => {
        const modalElement = document.getElementById('carrito');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
            cleanModalBackdrop();
        }
        onClose();
    }, [onClose]); // Dependencias de handleClose

    useEffect(() => {
        const modalElement = document.getElementById('carrito');
        const modal = new bootstrap.Modal(modalElement, { keyboard: false });

        modal.show();
        nameInputRef.current?.focus();

        modalElement.addEventListener('hidden.bs.modal', handleClose);

        return () => {
            modal.hide();
            cleanModalBackdrop();
            modalElement.removeEventListener('hidden.bs.modal', handleClose);
        };
    }, [handleClose]); // Ahora handleClose es una dependencia estable

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

    const calculateTotal = () => {
        const subtotal = cart.reduce((sum, p) => sum + parseFloat(p.precio || 0) * p.cantidad, 0);
        return delivery ? subtotal + 1200 : subtotal;
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
        if (delivery) {
            const addressHasLetters = /[a-zA-Z]{4,}/.test(deliveryAddress);
            const addressHasNumber = /\d/.test(deliveryAddress);
            const localityValid = /[a-zA-Z]{3,}/.test(locality);
            if (!addressHasLetters || !addressHasNumber) {
                showConfirmationAlert(`
                    <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                    El domicilio debe tener al menos 4 letras y 1 número.
                `);
                return;
            }
            if (!localityValid) {
                showConfirmationAlert(`
                    <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                    La localidad debe tener al menos 3 letras.
                `);
                return;
            }
        }
        if (!paymentMethod) {
            showConfirmationAlert(`
                <span style="color: red; font-size: 1.5rem;">⚠️</span><br>
                Selecciona una forma de pago.
            `);
            return;
        }

        let mensaje = "*Hola! Quiero hacer un pedido:*\n\n";
        cart.forEach(prod => {
            mensaje += `${prod.cantidad}x ${prod.nombre} - $${Math.round(parseFloat(prod.precio || 0) * prod.cantidad)} ${prod.comentario ? `(${prod.comentario})` : ""}\n`;
        });
        const subtotal = cart.reduce((sum, p) => sum + parseFloat(p.precio || 0) * p.cantidad, 0);
        const total = calculateTotal();
        mensaje += `\n*Subtotal:* $${Math.round(subtotal)}\n`;
        if (delivery) mensaje += `*Costo de envío:* $1200\n`;
        mensaje += `*Total:* $${Math.round(total)}\n\n`;
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

        showConfirmationAlert(`
            <span style="color: green; font-size: 2rem;">✅</span><br>
            ¡Tu pedido ha sido enviado con éxito!
        `);

        const whatsappUrl = `https://wa.me/5491140445556?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank');
        setCart([]);
        handleClose();
    };

    return (
        <div className="modal fade" id="carrito" tabIndex="-1" aria-labelledby="carritoLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="carritoLabel">Carrito</h5>
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">
                        {cart.length === 0 ? (
                            <p>Tu carrito está vacío.</p>
                        ) : (
                            <ul className="list-unstyled">
                                {cart.map((producto, index) => (
                                    <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                                        {`${producto.cantidad}x ${producto.nombre} - $${Math.round(parseFloat(producto.precio || 0) * producto.cantidad)} ${producto.comentario ? `(${producto.comentario})` : ""}`}
                                        <button className="btn btn-danger ms-2" onClick={() => removeItem(index)}>X</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <hr />
                        <strong>Subtotal: <span>${Math.round(cart.reduce((sum, p) => sum + parseFloat(p.precio || 0) * p.cantidad, 0))}</span></strong>
                        {delivery && <p>Costo de envío: $1200</p>}
                        <strong>Total: <span>${Math.round(calculateTotal())}</span></strong>
                        <form onSubmit={(e) => { e.preventDefault(); sendOrder(); }}>
                            <input
                                ref={nameInputRef}
                                type="text"
                                className="form-control mt-2"
                                placeholder="Nombre y Apellido*"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {name && (
                                <div className="mt-3">
                                    <p className="select-option-text">Seleccione uno:</p>
                                    <button
                                        type="button"
                                        className={`btn btn-delivery-takeaway ${delivery ? 'btn-selected' : ''}`}
                                        onClick={handleDelivery}
                                        aria-pressed={delivery}
                                    >
                                        Delivery
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-delivery-takeaway ${takeaway ? 'btn-selected' : ''}`}
                                        onClick={handleTakeaway}
                                        aria-pressed={takeaway}
                                    >
                                        Takeaway
                                    </button>
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
                                required
                            >
                                <option value="" disabled>Selecciona la forma de pago*</option>
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
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">Enviar pedido por WhatsApp</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartModal;