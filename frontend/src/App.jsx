// APP FILE
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Replace alerts with:
toast.success('Lead added successfully!');
toast.error('Failed to add lead');
toast.success('Lead status updated');

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage');
    } else {
      localStorage.removeItem('token');
      console.log('Token removed from localStorage');
    }
  }, [token]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route 
            path="/" 
            element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;