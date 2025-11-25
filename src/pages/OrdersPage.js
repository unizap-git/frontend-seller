import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/OrdersPage.css';

function OrdersPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const seller = JSON.parse(localStorage.getItem('seller') || 'null');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!seller) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [storeId]);

  const loadOrders = async () => {
    try {
      const response = await api.orderService.getOrdersByStore(storeId);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="orders-page">
      <div className="container">
        <h2>Store Orders</h2>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="order-info">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <p>No orders yet for this store.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
