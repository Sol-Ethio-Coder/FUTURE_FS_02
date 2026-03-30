// DASHBOARD COMPONENT
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeadDetail from './LeadDetail';
import AddLeadModal from './AddLeadModal';
import Analytics from './Analytics';
import EditLeadModal from './EditLeadModal';
import LoadingSkeleton from './LoadingSkeleton';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = ({ token, setToken }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    source: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads', {
        headers: { 'x-auth-token': token }
      });
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leads:', err);
      if (err.response?.status === 401) {
        setToken(null);
      }
      toast.error('Failed to fetch leads');
      setLoading(false);
    }
  };

  const updateStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      fetchLeads();
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${leadId}`, {
          headers: { 'x-auth-token': token }
        });
        fetchLeads();
        setSelectedLeads(selectedLeads.filter(id => id !== leadId));
        toast.success('Lead deleted successfully');
      } catch (err) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const bulkDelete = async () => {
    if (selectedLeads.length === 0) {
      toast.error('No leads selected');
      return;
    }
    
    if (window.confirm(`Delete ${selectedLeads.length} leads?`)) {
      try {
        await Promise.all(selectedLeads.map(id => 
          axios.delete(`http://localhost:5000/api/leads/${id}`, {
            headers: { 'x-auth-token': token }
          })
        ));
        fetchLeads();
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted`);
      } catch (err) {
        toast.error('Failed to delete leads');
      }
    }
  };

  const bulkStatusUpdate = async (newStatus) => {
    if (selectedLeads.length === 0) {
      toast.error('No leads selected');
      return;
    }
    
    try {
      await Promise.all(selectedLeads.map(id => 
        axios.put(`http://localhost:5000/api/leads/${id}/status`,
          { status: newStatus },
          { headers: { 'x-auth-token': token } }
        )
      ));
      fetchLeads();
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update leads');
    }
  };

  const selectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads.map(lead => lead._id));
    }
  };

  const toggleSelect = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Source', 'Status', 'Created Date', 'Notes Count'];
    const csvData = leads.map(lead => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.source}"`,
      lead.status,
      new Date(lead.createdAt).toLocaleDateString(),
      lead.notes?.length || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const filteredLeads = leads.filter(lead => {
    if (filter !== 'all' && lead.status !== filter) return false;
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !lead.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.source !== 'all' && lead.source !== filters.source) return false;
    if (filters.dateFrom && new Date(lead.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(lead.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1) : 0
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container">
      <Toaster position="top-right" />
      
      <div className="header">
        <div>
          <h1>Lead Management CRM</h1>
          <p style={{ color: 'white', marginTop: '5px' }}>
            {stats.total} total leads | {stats.conversionRate}% conversion rate
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className="btn btn-primary">
            Analytics
          </button>
          <button onClick={exportToCSV} className="btn btn-success" style={{ background: '#28a745' }}>
            Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            + Add Lead
          </button>
          <button onClick={() => setToken(null)} className="btn btn-danger">Logout</button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedLeads.length > 0 && (
        <div className="card" style={{ background: '#e3f2fd', border: '1px solid #2196f3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><strong>{selectedLeads.length}</strong> leads selected</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select onChange={(e) => bulkStatusUpdate(e.target.value)} className="btn" style={{ background: 'white' }}>
                <option value="">Update Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
              <button onClick={bulkDelete} className="btn btn-danger">Delete Selected</button>
              <button onClick={() => setSelectedLeads([])} className="btn">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {showAnalytics && leads.length > 0 && (
        <Analytics leads={leads} onClose={() => setShowAnalytics(false)} />
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>New</h3>
          <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.new}</div>
        </div>
        <div className="stat-card">
          <h3>Contacted</h3>
          <div className="stat-number" style={{ color: '#3b82f6' }}>{stats.contacted}</div>
        </div>
        <div className="stat-card">
          <h3>Converted</h3>
          <div className="stat-number" style={{ color: '#10b981' }}>{stats.converted}</div>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <div className="stat-number" style={{ color: '#8b5cf6' }}>{stats.conversionRate}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <button onClick={() => setFilter('all')} className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} style={{ marginRight: '5px' }}>
                All ({stats.total})
              </button>
              <button onClick={() => setFilter('new')} className={`btn ${filter === 'new' ? 'btn-primary' : ''}`} style={{ marginRight: '5px' }}>
                New ({stats.new})
              </button>
              <button onClick={() => setFilter('contacted')} className={`btn ${filter === 'contacted' ? 'btn-primary' : ''}`} style={{ marginRight: '5px' }}>
                Contacted ({stats.contacted})
              </button>
              <button onClick={() => setFilter('converted')} className={`btn ${filter === 'converted' ? 'btn-primary' : ''}`}>
                Converted ({stats.converted})
              </button>
            </div>
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
          </div>
          
          {/* Advanced Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid #eee' }}>
            <select
              value={filters.source}
              onChange={(e) => setFilters({...filters, source: e.target.value})}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
            >
              <option value="all">All Sources</option>
              <option>Website Contact Form</option>
              <option>Referral</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
              <option>Phone Call</option>
            </select>
            <input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <button onClick={() => setFilters({ source: 'all', dateFrom: '', dateTo: '' })} className="btn">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card">
        <h2 style={{ marginBottom: '15px' }}>📋 All Leads</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" onChange={selectAll} checked={selectedLeads.length === currentLeads.length && currentLeads.length > 0} />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map(lead => (
                <tr key={lead._id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => toggleSelect(lead._id)}
                    />
                  </td>
                  <td onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer', fontWeight: '500' }}>
                    {lead.name}
                  </td>
                  <td onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                    {lead.email}
                  </td>
                  <td onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                    {lead.source}
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      className={`status-badge status-${lead.status}`}
                      style={{ cursor: 'pointer', width: '110px' }}
                    >
                      <option value="new">🟡 New</option>
                      <option value="contacted">🔵 Contacted</option>
                      <option value="converted">🟢 Converted</option>
                    </select>
                  </td>
                  <td onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {lead.notes?.length || 0} 📝
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowEditModal(true);
                        }} 
                        className="btn" 
                        style={{ background: '#ffc107', color: '#856404', padding: '4px 12px' }}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteLead(lead._id)} className="btn btn-danger" style={{ padding: '4px 12px' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLeads.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No leads found. Click "Add Lead" to get started!
          </p>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              className="btn"
            >
              First
            </button>
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="btn"
            >
              Previous
            </button>
            <span style={{ padding: '8px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="btn"
            >
              Next
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages}
              className="btn"
            >
              Last
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedLead && !showEditModal && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          token={token}
          onUpdate={fetchLeads}
        />
      )}

      {showEditModal && selectedLead && (
        <EditLeadModal
          lead={selectedLead}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLead(null);
          }}
          onLeadUpdated={fetchLeads}
          token={token}
        />
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onLeadAdded={fetchLeads}
          token={token}
        />
      )}
    </div>
  );
};

export default Dashboard;