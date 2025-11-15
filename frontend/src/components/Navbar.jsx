import React from 'react';
import { LogOut, Shield } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>
          <span className="brand-text">Asset Manager</span>
        </div>
        
        <div className="nav-user">
          <span className="user-welcome">Welcome, {user.username}</span>
          <button className="btn btn-secondary logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;