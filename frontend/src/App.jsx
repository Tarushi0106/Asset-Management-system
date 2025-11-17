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
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!user && token && userData) setUser(JSON.parse(userData));
    if (user) fetchAssets(token);
  }, [user, filters]);
 
  const fetchAssets = async (token) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${API_BASE}/assets?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssets(res.data);
    } catch {
      showMessage("Failed to fetch assets", "error", setMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    setUser(data);
    showMessage("Login successful!", "success", setMessage);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAssets([]);
  };

  const handleAssetCreate = (asset) => {
    setAssets([asset, ...assets]);
    setShowAssetForm(false);
    showMessage("Asset created!", "success", setMessage);
  };

  const handleAssetUpdate = (asset) => {
    setAssets(assets.map(a => a.id === asset.id ? asset : a));
    setEditingAsset(null);
    setShowAssetForm(false);
    showMessage("Updated successfully!", "success", setMessage);
  };

  const handleAssetDelete = (id) => {
    setAssets(assets.filter(a => a.id !== id));
    showMessage("Deleted!", "success", setMessage);
  };

  if (!user) {
    return (
      <div className="app">
        <LoginForm onLogin={handleLogin} />
        {message.text && <div className={`message message-${message.type}`}>{message.text}</div>}
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {message.text && <div className={`message message-${message.type}`}>{message.text}</div>}

        <div className="content-header">
          <div>
            <h1>Asset Management</h1>
            <p>Manage your organization's assets efficiently</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingAsset(null); setShowAssetForm(true); }}>
            + Add New Asset
          </button>
        </div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <p>Loading assets...</p>
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

        {!loading && assets.length === 0 && (
          <div className="empty-state">
            <h3>No assets found</h3>
            <p>Create your first asset</p>
          </div>
        )}
      </main>

      {showAssetForm && (
        <AssetForm
          asset={editingAsset}
          onClose={() => { setShowAssetForm(false); setEditingAsset(null); }}
          onCreate={handleAssetCreate}
          onUpdate={handleAssetUpdate}
          onError={(e) => showMessage(e, "error", setMessage)}
        />
      )}
    </div>
  );
}

export default App;
