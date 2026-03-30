// LOGIN COMPONENT
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate(); // Add navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Attempting to login with:', username);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const url = `http://localhost:5000${endpoint}`;
      console.log('Calling:', url);
      
      const response = await axios.post(url, {
        username,
        password
      });
      
      console.log('Response received:', response.data);
      
      // Set the token
      setToken(response.data.token);
      
      // Force navigation to dashboard
      navigate('/');
      
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.msg || err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          {isRegistering ? 'Create Account' : 'Login to CRM'}
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;