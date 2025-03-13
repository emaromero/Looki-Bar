import React, { useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import '../styles.css';

function ConfirmationModal({ message, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            const modal = new bootstrap.Modal(document.getElementById('confirmationModal'), { keyboard: true, backdrop: true });
            modal.show();

            const timer = setTimeout(() => {
                modal.hide();
                onClose();
            }, 1500);

            return () => {
                clearTimeout(timer);
                modal.hide();
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal fade" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content confirmation-content">
                    <div className="modal-body text-center">
                        <div dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;