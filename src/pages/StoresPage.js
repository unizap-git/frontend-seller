import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/StoresPage.css';

function StoresPage() {
  const navigate = useNavigate();
  const seller = JSON.parse(localStorage.getItem('seller') || 'null');
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeUrl: '',
    description: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (!seller) {
      navigate('/login');
      return;
    }
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await api.storeService.getStoresBySeller(seller.id);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.storeService.createStore({
        ...formData,
        sellerId: seller.id,
      });
      alert('Store created successfully!');
      setShowForm(false);
      setFormData({ storeName: '', storeUrl: '', description: '', logoUrl: '' });
      loadStores();
    } catch (error) {
      alert('Failed to create store. URL might already exist.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await api.storeService.deleteStore(id);
        loadStores();
      } catch (error) {
        alert('Failed to delete store');
      }
    }
  };

  return (
    <div className="stores-page">
      <div className="container">
        <div className="page-header">
          <h2>My Stores</h2>
          <button onClick={() => setShowForm(!showForm)} className="create-btn">
            {showForm ? 'Cancel' : 'Create Store'}
          </button>
        </div>

        {showForm && (
          <div className="store-form">
            <h3>Create New Store</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Store Name *</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Store URL * (unique)</label>
                <input
                  type="text"
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                  placeholder="my-awesome-store"
                  required
                />
                <small>Customer URL: http://localhost:3000/store/{formData.storeUrl || 'your-url'}</small>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-btn">Create Store</button>
            </form>
          </div>
        )}

        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3>{store.storeName}</h3>
              <p className="store-url">URL: {store.storeUrl}</p>
              <p>{store.description}</p>
              <div className="store-actions">
                <Link to={`/products/${store.id}`} className="btn btn-primary">Products</Link>
                <Link to={`/orders/${store.id}`} className="btn btn-secondary">Orders</Link>
                <button onClick={() => handleDelete(store.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {stores.length === 0 && !showForm && (
          <div className="no-stores">
            <p>You haven't created any stores yet.</p>
            <p>Click "Create Store" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoresPage;
