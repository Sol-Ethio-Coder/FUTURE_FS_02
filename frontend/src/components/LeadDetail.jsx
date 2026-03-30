// LEADDETAIL COMPONENT
import React, { useState } from 'react';
import axios from 'axios';

const LeadDetail = ({ lead, onClose, token, onUpdate }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/leads/${lead._id}/notes`,
        { text: note },
        { headers: { 'x-auth-token': token } }
      );
      setNote('');
      onUpdate();
    } catch (err) {
      alert('Failed to add note');
    }
    setLoading(false);
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
            onChange={(e) => {
              axios.put(`http://localhost:5000/api/leads/${lead._id}/status`,
                { status: e.target.value },
                { headers: { 'x-auth-token': token } }
              ).then(() => onUpdate());
            }}
            style={{ width: 'auto' }}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
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
              <p style={{ color: '#999', fontStyle: 'italic' }}>No notes yet</p>
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
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        <button onClick={onClose} className="btn" style={{ marginTop: '10px', width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;