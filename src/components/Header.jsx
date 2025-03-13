// src/components/Header.jsx
import React from 'react';

function Header() {
    return (
        <header>
            <div className="header-content">
                <img src="/images/logo-looki.png" alt="Logo" className="logo" />
                <p>
                    <i className="far fa-clock"></i> Horarios: Lunes a jueves de 18:00 a 23:00<br />Vie, Sáb y Dom de 18:00 a 00:00
                </p>
            </div>
        </header>
    );
}

export default Header;