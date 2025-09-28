import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaMapMarkedAlt, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import './index.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="main-header">
      <div className="nav-logo">
        <img
          src="https://framerusercontent.com/images/jvU92e3wua5TEY21eh31gwlg9xs.png"
          alt="Logo"
        />
        <span className="nav-title">Tapza HoardMgmt</span>
      </div>

      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        {/* Close button inside the menu */}
        {menuOpen && (
          <div className="close-btn" onClick={closeMenu}>
            <FaTimes />
          </div>
        )}

        <NavLink to="/" onClick={closeMenu}>
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        <NavLink to="/view-all-flexy" onClick={closeMenu}>
          <FaList className="nav-icon" />
          <span className="nav-text">View All Flexys</span>
        </NavLink>
        <NavLink to="/route-finder" onClick={closeMenu}>
          <FaMapMarkedAlt className="nav-icon" />
          <span className="nav-text">Route Finder</span>
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          <FaEnvelope className="nav-icon" />
          <span className="nav-text">Contact Admin</span>
        </NavLink>
      </nav>

      {/* Hamburger only shows when menu closed */}
      {!menuOpen && (
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </div>
      )}
    </header>
  );
};

export default Navbar;
