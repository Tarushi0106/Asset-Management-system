import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const AssetForm = ({ asset, onClose, onCreate, onUpdate, onError }) => {
  const [formData, setFormData] = useState({
    asset_id: '',
    name: '',
    category: 'Laptop',
    status: 'Available',
    assigned_to: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        asset_id: asset.asset_id,
        name: asset.name,
        category: asset.category,
        status: asset.status,
        assigned_to: asset.assigned_to || ''
      });
    }
  }, [asset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (asset) {
        const response = await axios.put(`${API_BASE}/assets/${asset.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onUpdate(response.data);
      } else {
        const response = await axios.post(`${API_BASE}/assets`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onCreate(response.data);
      }
    } catch (err) {
      onError(err.response?.data?.error || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{asset ? 'Edit Asset' : 'Add New Asset'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-group">
            <label htmlFor="asset_id">Asset ID *</label>
            <input
              type="text"
              id="asset_id"
              value={formData.asset_id}
              onChange={(e) => handleChange('asset_id', e.target.value)}
              placeholder="e.g., LAP-001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., MacBook Pro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="Laptop">Laptop</option>
              <option value="License">License</option>
              <option value="Access Card">Access Card</option>
              <option value="Monitor">Monitor</option>
              <option value="Phone">Phone</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="Faulty">Faulty</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assigned_to">Assigned To</label>
            <input
              type="text"
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
              placeholder="e.g., John Doe"
              disabled={formData.status === 'Faulty'}
            />
            {formData.status === 'Faulty' && (
              <p className="form-hint">Faulty assets cannot be assigned to anyone.</p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (asset ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;