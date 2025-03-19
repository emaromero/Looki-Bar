import React, { useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import { cleanModalBackdrop } from './ModalUtils';

function ProductModal({ currentProduct, onClose, onProceed }) {
    useEffect(() => {
        if (currentProduct) {
            const modal = new bootstrap.Modal(document.getElementById('popup'), { keyboard: false });
            modal.show();
            return () => {
                modal.hide();
                cleanModalBackdrop();
            };
        }
    }, [currentProduct]);

    if (!currentProduct) return null;

    return (
        <div className="modal fade" id="popup" tabIndex="-1" aria-labelledby="popupLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="popupLabel">{currentProduct.nombre}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                onClose();
                                const modal = bootstrap.Modal.getInstance(document.getElementById('popup'));
                                modal.hide();
                                cleanModalBackdrop();
                            }}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    <div className="modal-body text-center">
                        <img
                            src={currentProduct.imagen || 'https://via.placeholder.com/150'} // Cambiado de Imagen a imagen
                            className="img-fluid mb-3"
                            alt={currentProduct.nombre}
                        />
                        <p>{currentProduct.descripcion}</p>
                        <div className="price-button-container">
                            <strong>${Math.round(parseFloat(currentProduct.precio || 0))}</strong>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    onProceed();
                                    const modal = bootstrap.Modal.getInstance(document.getElementById('popup'));
                                    modal.hide();
                                    cleanModalBackdrop();
                                }}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;