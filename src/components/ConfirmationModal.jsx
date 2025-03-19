import React, { useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import '../styles.css';
import { cleanModalBackdrop } from './ModalUtils'; // Ajustada la importación

function ConfirmationModal({ message, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            const modal = new bootstrap.Modal(document.getElementById('confirmationModal'), { keyboard: true, backdrop: true });
            modal.show();

            const timer = setTimeout(() => {
                modal.hide();
                cleanModalBackdrop();
                onClose();
            }, 1500);

            return () => {
                clearTimeout(timer);
                modal.hide();
                cleanModalBackdrop();
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal fade confirmation-modal" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body text-center">
                        <div dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;