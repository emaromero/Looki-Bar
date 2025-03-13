// src/components/ConfirmationModal.jsx
import React, { useEffect } from 'react';

function ConfirmationModal({ message, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 1000); // Cierra automáticamente después de 1 segundo
            return () => clearTimeout(timer); // Limpia el temporizador al desmontar
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div
                        className="modal-body text-center"
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
        </div>
    );
}

export default ConfirmationModal;