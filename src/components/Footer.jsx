import React from 'react';

function Footer() {
    return (
        <footer>
            <div className="social-icons">
                <a href="https://www.instagram.com/lookibar/" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61572603162921&ref=ig_profile_ac" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-facebook"></i>
                </a>
            </div>
            <p>
                <a href="https://www.google.com/maps/dir//R.+Caama%C3%B1o+844,+B1631+Villa+Rosa,+Provincia+de+Buenos+Aires/@-34.4149642,-58.846448,17z" target="_blank" rel="noopener noreferrer">
                    Av Caamaño 844, Pilar.
                </a>
            </p>
            <p className="designed-by">
                Diseño y desarrollo por <a href="https://cloverdigital.vercel.app/" target="_blank" rel="noopener noreferrer">Clover Digital</a> | Todos los derechos reservados.
            </p>
        </footer>
    );
}

export default Footer;