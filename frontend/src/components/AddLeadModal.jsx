// ADD LEADMODAL COMPONENT
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AddLeadModal = ({ onClose, onLeadAdded, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: 'Website Contact Form'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use API_URL instead of localhost
      await axios.post(`${API_URL}/api/leads`, formData);
      onLeadAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add lead');
    }
    setLoading(false);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px' }}>➕ Add New Lead</h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="form-group">
            <label>Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
            >
              <option>Website Contact Form</option>
              <option>Referral</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
              <option>Phone Call</option>
              <option>Conference</option>
              <option>Other</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Lead'}
            </button>
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;