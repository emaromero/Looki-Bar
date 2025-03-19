import React, { useState, useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import { cleanModalBackdrop } from './ModalUtils';

function CustomizeModal({ currentProduct, setCurrentProduct, cart, updateCart, setShowCustomizeModal, showConfirmationAlert }) {
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (currentProduct) {
            const modal = new bootstrap.Modal(document.getElementById('personalizar'), { keyboard: false });
            modal.show();
            document.getElementById('cantidadInput')?.focus();
            return () => {
                modal.hide();
                cleanModalBackdrop();
            };
        }
    }, [currentProduct]);

    if (!currentProduct) return null;

    const handleIncrement = () => setQuantity(quantity + 1);
    const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handleConfirm = () => {
        const updatedProduct = { ...currentProduct, cantidad: quantity, comentario: comment };
        const newCart = [...cart, updatedProduct];
        updateCart(newCart);

        const modal = bootstrap.Modal.getInstance(document.getElementById('personalizar'));
        modal.hide();
        cleanModalBackdrop();

        showConfirmationAlert(`
            <span style="color: green; font-size: 2rem;">✅</span><br>
            ${updatedProduct.nombre} ha sido agregado con éxito
        `); // Cambiado de Nombre a nombre

        setQuantity(1);
        setComment('');
        setCurrentProduct(null);
        setShowCustomizeModal(false);
    };

    return (
        <div className="modal fade" id="personalizar" tabIndex="-1" aria-labelledby="personalizarLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="personalizarLabel">Personaliza tu pedido</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                setCurrentProduct(null);
                                setShowCustomizeModal(false);
                            }}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    <div className="modal-body text-center">
                        <div className="d-flex justify-content-center align-items-center">
                            <button className="btn btn-outline-secondary quantity-btn" onClick={handleDecrement}>-</button>
                            <input
                                id="cantidadInput"
                                type="number"
                                className="form-control text-center mx-2"
                                value={quantity}
                                min="1"
                                style={{ width: '60px' }}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <button className="btn btn-outline-secondary quantity-btn" onClick={handleIncrement}>+</button>
                        </div>
                        <textarea
                            className="form-control mt-3"
                            placeholder="Comentario adicional (opcional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="btn btn-success mt-3" onClick={handleConfirm}>Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomizeModal;