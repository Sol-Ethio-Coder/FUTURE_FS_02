// EDIT LEADMODAL COMPONENT
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config';

const EditLeadModal = ({ lead, onClose, onLeadUpdated, token }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    source: lead.source
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Valid email is required');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.put(`${API_URL}/api/leads/${lead._id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Lead updated successfully');
      onLeadUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update lead');
      toast.error('Failed to update lead');
    }
    setLoading(false);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px' }}>✏️ Edit Lead</h2>
        
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
              {loading ? 'Updating...' : 'Update Lead'}
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

export default EditLeadModal;
