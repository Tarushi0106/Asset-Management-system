import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import FilterBar from './components/FilterBar';
import AssetForm from './components/AssetForm';
import AssetCard from './components/AssetCard';
import { showMessage } from './utils';

const API_BASE = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      fetchAssets(token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [filters]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE}/assets?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssets(response.data);
    } catch (err) {
      showMessage('Failed to fetch assets', 'error', setMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    showMessage('Login successful!', 'success', setMessage);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAssets([]);
  };

  const handleAssetCreate = (newAsset) => {
    setAssets([newAsset, ...assets]);
    setShowAssetForm(false);
    showMessage('Asset created successfully!', 'success', setMessage);
  };

  const handleAssetUpdate = (updatedAsset) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset));
    setShowAssetForm(false);
    setEditingAsset(null);
    showMessage('Asset updated successfully!', 'success', setMessage);
  };

  const handleAssetDelete = (assetId) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
    showMessage('Asset deleted successfully!', 'success', setMessage);
  };

  if (!user) {
    return (
      <div className="app">
        <LoginForm onLogin={handleLogin} />
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="main-content">
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="content-header">
          <div className="header-text">
            <h1>Asset Management</h1>
            <p>Manage your organization's assets efficiently</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingAsset(null);
              setShowAssetForm(true);
            }}
          >
            <span className="btn-icon">+</span>
            Add New Asset
          </button>
        </div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assets...</p>
          </div>
        ) : (
          <div className="assets-grid">
            {assets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={setEditingAsset}
                onDelete={handleAssetDelete}
                onShowForm={setShowAssetForm}
              />
            ))}
          </div>
        )}

        {assets.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No assets found</h3>
            <p>Get started by creating your first asset</p>
          </div>
        )}
      </main>

      {showAssetForm && (
        <AssetForm
          asset={editingAsset}
          onClose={() => {
            setShowAssetForm(false);
            setEditingAsset(null);
          }}
          onCreate={handleAssetCreate}
          onUpdate={handleAssetUpdate}
          onError={(error) => showMessage(error, 'error', setMessage)}
        />
      )}
    </div>
  );
}

export default App;