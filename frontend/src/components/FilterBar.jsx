import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search assets..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <Filter size={18} className="filter-icon" />
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="License">License</option>
          <option value="Access Card">Access Card</option>
          <option value="Monitor">Monitor</option>
          <option value="Phone">Phone</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Allocated">Allocated</option>
          <option value="Faulty">Faulty</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;