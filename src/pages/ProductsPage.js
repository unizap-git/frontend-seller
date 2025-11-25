import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/ProductsPage.css';

function ProductsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const seller = JSON.parse(localStorage.getItem('seller') || 'null');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    category: '',
  });

  useEffect(() => {
    if (!seller) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [storeId]);

  const loadProducts = async () => {
    try {
      const response = await api.productService.getProductsByStore(storeId);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.productService.createProduct({
        ...formData,
        storeId: parseInt(storeId),
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      alert('Product created successfully!');
      setShowForm(false);
      setFormData({ productName: '', description: '', price: '', stockQuantity: '', imageUrl: '', category: '' });
      loadProducts();
    } catch (error) {
      alert('Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.productService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h2>Manage Products</h2>
          <button onClick={() => setShowForm(!showForm)} className="create-btn">
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="product-form">
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-btn">Add Product</button>
            </form>
          </div>
        )}

        <div className="products-table">
          {products.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>{product.category || 'N/A'}</td>
                    <td>${product.price}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      <span className={`status ${product.active ? 'active' : 'inactive'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-products">
              <p>No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
