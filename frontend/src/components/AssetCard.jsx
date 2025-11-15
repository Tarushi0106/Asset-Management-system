import React from 'react';
import { Edit2, Trash2, Laptop, Key, CreditCard, Monitor, Smartphone } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const categoryIcons = {
  'Laptop': Laptop,
  'License': Key,
  'Access Card': CreditCard,
  'Monitor': Monitor,
  'Phone': Smartphone
};

const statusColors = {
  'Available': 'status-available',
  'Allocated': 'status-allocated',
  'Faulty': 'status-faulty'
};

const AssetCard = ({ asset, onEdit, onDelete, onShowForm }) => {
  const IconComponent = categoryIcons[asset.category] || Laptop;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/assets/${asset.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(asset.id);
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const handleEdit = () => {
    onEdit(asset);
    onShowForm(true);
  };

  return (
    <div className="asset-card">
      <div className="asset-header">
        <div className="asset-icon">
          <IconComponent size={20} />
        </div>
        <div className="asset-info">
          <h3 className="asset-name">{asset.name}</h3>
          <p className="asset-id">{asset.asset_id}</p>
        </div>
        <div className="asset-actions">
          <button className="btn-icon" onClick={handleEdit}>
            <Edit2 size={16} />
          </button>
          <button className="btn-icon btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="asset-details">
        <div className="detail-row">
          <span className="detail-label">Category</span>
          <span className="detail-value">{asset.category}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className={`status-badge ${statusColors[asset.status]}`}>
            {asset.status}
          </span>
        </div>

        {asset.assigned_to && (
          <div className="detail-row">
            <span className="detail-label">Assigned To</span>
            <span className="detail-value">{asset.assigned_to}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;