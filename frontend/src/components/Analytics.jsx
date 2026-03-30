// ANALYTICS COMPONENT
import React from 'react';

const Analytics = ({ leads, onClose }) => {
  const statusData = [
    { name: 'New', value: leads.filter(l => l.status === 'new').length, color: '#f59e0b' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: '#3b82f6' },
    { name: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#10b981' }
  ];
  
  const sourceData = {};
  leads.forEach(lead => {
    sourceData[lead.source] = (sourceData[lead.source] || 0) + 1;
  });
  
  const topSources = Object.entries(sourceData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
  
  // Get leads from last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString();
    const count = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt).toLocaleDateString();
      return leadDate === dateStr;
    }).length;
    last7Days.push({ date: dateStr, count });
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>📊 Analytics Dashboard</h2>
          <button onClick={onClose} style={{ fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{totalLeads}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Leads</div>
          </div>
          <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{convertedLeads}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Converted</div>
          </div>
          <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{conversionRate}%</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Conversion Rate</div>
          </div>
        </div>
        
        {/* Status Distribution */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Lead Status Distribution</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {statusData.map(item => (
              <div key={item.name} style={{ flex: 1, minWidth: '100px' }}>
                <div style={{ 
                  background: item.color, 
                  height: '100px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: `${(item.value / totalLeads) * 100}%`, 
                    width: '100%', 
                    background: item.color,
                    transition: 'height 0.3s'
                  }} />
                  <div style={{ position: 'absolute', bottom: '10px', color: 'white', fontWeight: 'bold' }}>
                    {item.value}
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: '500' }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Sources */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Top Lead Sources</h3>
          <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
            {topSources.map(([source, count]) => (
              <div key={source} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{source}</span>
                  <span>{count} leads ({((count / totalLeads) * 100).toFixed(1)}%)</span>
                </div>
                <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(count / totalLeads) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Weekly Activity */}
        <div>
          <h3 style={{ marginBottom: '10px' }}>Last 7 Days Activity</h3>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
            {last7Days.map(day => (
              <div key={day.date} style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ 
                  background: day.count > 0 ? '#667eea' : '#e5e7eb',
                  color: day.count > 0 ? 'white' : '#9ca3af',
                  padding: '8px',
                  borderRadius: '8px',
                  marginBottom: '5px'
                }}>
                  {day.count}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;