export const cleanModalBackdrop = () => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
};