// LEADDETAIL COMPONENT
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const LeadDetail = ({ lead, onClose, token, onUpdate }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/leads/${lead._id}/notes`,
        { text: note },
        { headers: { 'x-auth-token': token } }
      );
      setNote('');
      onUpdate();
      alert('Note added successfully!');
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note');
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/api/leads/${lead._id}/status`,
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      onUpdate();
      alert('Status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '15px' }}>Lead Details</h2>
        <hr style={{ marginBottom: '15px' }} />

        <div className="form-group">
          <label>Name:</label>
          <p style={{ fontWeight: '500' }}>{lead.name}</p>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <p>{lead.email}</p>
        </div>

        <div className="form-group">
          <label>Source:</label>
          <p>{lead.source}</p>
        </div>

        <div className="form-group">
          <label>Created:</label>
          <p>{new Date(lead.createdAt).toLocaleString()}</p>
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value)}
            style={{ width: 'auto', padding: '5px 10px' }}
          >
            <option value="new">🟡 New</option>
            <option value="contacted">🔵 Contacted</option>
            <option value="converted">🟢 Converted</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.map((n, i) => (
                <div key={i} style={{
                  borderBottom: '1px solid #eee',
                  padding: '10px 0',
                  marginBottom: '5px'
                }}>
                  <p style={{ margin: '0 0 5px 0' }}>{n.text}</p>
                  <small style={{ color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center' }}>No notes yet</p>
            )}
          </div>
        </div>

        <form onSubmit={addNote}>
          <div className="form-group">
            <label>Add Note:</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              placeholder="Type your note here..."
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '5px' }}>
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        <button onClick={onClose} className="btn" style={{ marginTop: '15px', width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;