// LOADINGSKELETON COMPONENT
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container">
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .skeleton {
            animation: pulse 1.5s ease-in-out infinite;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
          }
        `}
      </style>
      
      {/* Header Skeleton */}
      <div className="header">
        <div>
          <div className="skeleton" style={{ height: '40px', width: '300px', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '20px', width: '200px', borderRadius: '4px', marginTop: '10px' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton" style={{ height: '40px', width: '100px', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '40px', width: '100px', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '40px', width: '100px', borderRadius: '8px' }}></div>
        </div>
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="stats-grid">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="card">
            <div className="skeleton" style={{ height: '20px', width: '100px', margin: '0 auto 10px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ height: '40px', width: '80px', margin: '0 auto', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
      
      {/* Filter Bar Skeleton */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: '36px', width: '80px', borderRadius: '8px' }}></div>
            ))}
          </div>
          <div className="skeleton" style={{ height: '36px', width: '250px', borderRadius: '8px' }}></div>
        </div>
      </div>
      
      {/* Table Skeleton */}
      <div className="card">
        <div className="skeleton" style={{ height: '30px', width: '150px', marginBottom: '15px', borderRadius: '4px' }}></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                {[1,2,3,4,5,6,7].map(i => (
                  <th key={i}>
                    <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '4px' }}></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  {[1,2,3,4,5,6,7].map(j => (
                    <td key={j}>
                      <div className="skeleton" style={{ height: '16px', width: j === 1 ? '120px' : '100px', borderRadius: '4px' }}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;