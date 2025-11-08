import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BaseLayout.css';

function BaseLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="base-layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-text">JCORP</span>
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/')}`}
          >
            <span className="nav-code">[01]</span>
            <span className="nav-label">HOME</span>
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about')}`}
          >
            <span className="nav-code">[02]</span>
            <span className="nav-label">ABOUT</span>
          </Link>
          <Link 
            to="/portfolio" 
            className={`nav-link ${isActive('/portfolio')}`}
          >
            <span className="nav-code">[03]</span>
            <span className="nav-label">PORTFOLIO</span>
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact')}`}
          >
            <span className="nav-code">[04]</span>
            <span className="nav-label">CONTACT</span>
          </Link>
          <Link 
            to="/payment" 
            className={`nav-link ${isActive('/payment')}`}
          >
            <span className="nav-code">[05]</span>
            <span className="nav-label">PAYMENT</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 JCORP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default BaseLayout;

