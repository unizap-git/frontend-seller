import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const seller = JSON.parse(localStorage.getItem('seller') || 'null');

  useEffect(() => {
    if (!seller) {
      navigate('/login');
    }
  }, [seller, navigate]);

  if (!seller) return null;

  return (
    <div className="dashboard">
      <div className="container">
        <h2>Seller Dashboard</h2>
        <p className="welcome-text">Welcome back, {seller.fullName}!</p>

        <div className="dashboard-cards">
          <Link to="/stores" className="dashboard-card">
            <h3>My Stores</h3>
            <p>Manage your online stores</p>
          </Link>
        </div>

        <div className="info-section">
          <h3>Getting Started</h3>
          <ol>
            <li>Create a store with a unique URL</li>
            <li>Add products to your store</li>
            <li>Share your store URL with customers</li>
            <li>Manage orders from your dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
