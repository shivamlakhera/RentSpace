import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation Checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address or password.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for HTTP-only cookies
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      // Save user basic info to localStorage for UI role checks
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserRole(data.user.role);

      // Show Success Modal instead of immediate redirect
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Welcome Back to RentSpace</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-auth">Login</button>
          <p className="auth-redirect">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </form>
      </div>

      {/* Custom Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">🎉</div>
            <h3>Login Successful!</h3>
            <p>Welcome back to RentSpace. You have logged in successfully.</p>
            <button 
              onClick={() => {
                setShowModal(false);
                if (userRole === 'owner') {
                  navigate('/owner-dashboard');
                } else {
                  navigate('/');
                }
              }}
              className="btn-modal-close"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}