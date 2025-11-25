import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('seller') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('seller');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-Commerce Seller</h1>
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <span className="user-name">Welcome, {user.fullName}</span>
              <Link to="/stores" className="nav-link">My Stores</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
